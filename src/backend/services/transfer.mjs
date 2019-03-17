import {tokenContract} from "../../helpers/get-deployed-smart-contracts.mjs";
import getEthereumAccounts from "../../helpers/get-ethereum-accounts.mjs";
import web3 from "../../helpers/web3Instance.mjs";

let accounts = getEthereumAccounts(web3);

export const sendTransferPreSignedTransaction = (transactionObject) => {
  return tokenContract.methods.transferPreSigned(
    transactionObject.signature,
    transactionObject.from,
    transactionObject.to,
    transactionObject.value.toString(),
    transactionObject.fee.toString(),
    transactionObject.nonce.toString()
  )
    .send({
      from: accounts[0],
      gas: 80000000
    })
};