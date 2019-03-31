import {tokenContract} from "../../helpers/get-deployed-smart-contracts.mjs";
import getEthereumAccounts from "../../helpers/get-ethereum-accounts.mjs";
import web3 from "../../helpers/web3Instance.mjs";
import {getTokenBalance} from "../../smartcontracts/methods/token-balances.mjs";



export const sendTransferPreSignedTransaction = async (transactionObject) => {

  let accounts = await getEthereumAccounts(web3);

  return tokenContract.methods.transferPreSigned(
    transactionObject.signature,
    transactionObject.from,
    transactionObject.to,
    transactionObject.value.toString(),
    transactionObject.fee.toString(),
    transactionObject.nonce.toString()
  )
    .send({
      from: "0x5c59065f0486Af304B7E1A4243905527A35E0DB5",
      gas: 80000000
    })
    .then(async (receipt) => {
      console.log("500 tokens transferred from account 1 to account 2\n" +
        "Transaction sent by account 0: Fee of 5 tokens transferred from account 1 to account 0");

      await getTokenBalance(tokenContract, accounts[0], accounts[0])
        .then((balance) => {
          console.log("Account 0 has balance " + balance);
        });

      await getTokenBalance(tokenContract, accounts[1], accounts[1])
        .then((balance) => {
          console.log("Account 1 has balance " + balance);
        });

      await getTokenBalance(tokenContract, accounts[2], accounts[2])
        .then((balance) => {
          console.log("Account 2 has balance " + balance);
        });
    });
};