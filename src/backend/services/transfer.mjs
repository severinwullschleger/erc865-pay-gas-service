import Web3PromiEvent from "web3-core-promievent";
import {
  saveTransaction,
  updateTransaction
} from "../db/transactions-services.mjs";
import { TRANSACTION_STATUS } from "../db/transaction-states.mjs";
import config from "../../config.json";
import { tokenContracts } from "../../helpers/get-contracts.mjs";

export const sendTransferPreSignedTransaction = async transactionObject => {
  let promiEvent = Web3PromiEvent();

  tokenContracts[transactionObject.tokenContractIndex].contractObj.methods
    .transferPreSigned(
      transactionObject.signature,
      transactionObject.from,
      transactionObject.to,
      transactionObject.value.toString(),
      tokenContracts[
        transactionObject.tokenContractIndex
      ].feeTransfer.toString(),
      transactionObject.nonce.toString()
    )
    .send({
      from: config.unlockedServiceAccount,
      gas: 8000000
    })
    .on("transactionHash", async tx => {
      const saveToDbSuccess = await saveTransaction(
        tx,
        transactionObject,
        config.unlockedServiceAccount,
        "transfer"
      );

      const txObject = { txHash: tx, saveToDbSuccess };
      promiEvent.eventEmitter.emit("transactionHash", txObject);
      promiEvent.resolve(txObject);
    })

    .on("receipt", async receipt => {
      updateTransaction(
        receipt.transactionHash,
        receipt.status === true
          ? TRANSACTION_STATUS.CONFIRMED
          : TRANSACTION_STATUS.REVERTED,
        receipt
      )
        .then(() => {
          promiEvent.eventEmitter.emit("receipt", {
            receipt,
            updateDBSuccess: true
          });
        })
        .catch(error => {
          promiEvent.eventEmitter.emit("receipt", {
            receipt,
            updateDBSuccess: false,
            error
          });
        });
    })
    .on("error", errorReceipt => {
      console.log(errorReceipt);
      if (errorReceipt) {
        const errorObj = JSON.parse(
          errorReceipt.message.substring(
            "Transaction has been reverted by the EVM:\\n".length - 1
          )
        );
        updateTransaction(
          errorObj.transactionHash,
          TRANSACTION_STATUS.ERROR,
          null,
          errorObj
        )
          .then(() => {
            promiEvent.eventEmitter.emit("error", {
              errorObj,
              updateDBSuccess: true
            });
          })
          .catch(error => {
            promiEvent.eventEmitter.emit("error", {
              errorObj,
              updateDBSuccess: false,
              error
            });
          });
      } else {
        promiEvent.eventEmitter.emit("error", {
          errorMessage: "An error occurred.",
          updateDBSuccess: false
        });
      }
    });

  return promiEvent.eventEmitter;
};
