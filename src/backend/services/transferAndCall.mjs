import Web3PromiEvent from "web3-core-promievent";
import {
  saveTransaction,
  updateTransaction
} from "../db/transactions-services.mjs";
import { TRANSACTION_STATUS } from "../db/transaction-states.mjs";
import config from "../../config.json";
import { tokenContracts } from "../../helpers/get-contracts.mjs";
import web3 from "../../helpers/web3Instance.mjs";

export const sendTransferAndCallPreSignedTransaction = async transactionObject => {
  let promiEvent = Web3PromiEvent();

  await web3.eth.personal
    .unlockAccount(config.unlockedServiceAccount, config.unlockPassword, 10000)  // 24 hours
    .then(console.log(config.unlockedServiceAccount, "unlocked"))
    .catch(console.error);

  const tokenContract = tokenContracts.find(
    contract => contract.address === transactionObject.tokenContract
  );

  tokenContract.contractObj.methods
    .transferAndCallPreSigned(
      transactionObject.signature,
      transactionObject.from,
      transactionObject.to,
      transactionObject.value.toString(),
      tokenContract.feeTransferAndCall.toString(),
      transactionObject.nonce.toString(),
      transactionObject.methodName,
      transactionObject.callParametersEncoded
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
        "transferAndCall"
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
          TRANSACTION_STATUS.REVERTED,
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

export const feeEstimation = async transactionObject => {
  return tokenContracts[
    transactionObject.tokenContractIndex
  ].contractObj.methods
    .transferAndCallPreSigned(
      transactionObject.signature,
      transactionObject.from,
      transactionObject.to,
      transactionObject.value.toString(),
      tokenContracts[
        transactionObject.tokenContractIndex
      ].feeTransferAndCall.toString(),
      transactionObject.nonce.toString(),
      transactionObject.methodName,
      transactionObject.callParametersEncoded
    )
    .estimateGas({
      from: config.unlockedServiceAccount,
      gas: 8000000
    })
    .then(async function(gasAmount) {
      console.log(gasAmount);

      let gasPrice = await web3.eth.getGasPrice();

      return (
        (gasAmount * web3.utils.fromWei(gasPrice)) /
        tokenContracts[transactionObject.tokenContractIndex]
          .defaultTokenToEthPrice
      );
    })
    .catch(function(error) {
      return tokenContracts[
        transactionObject.tokenContractIndex
      ].feeTransferAndCall;
    });
};
