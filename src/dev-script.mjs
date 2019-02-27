import getEthereumAccounts from "./helpers/get-ethereum-accounts.mjs";
import web3 from "./helpers/web3Instance.mjs";
import {getTokenBalance} from "./smartcontracts/methods/token-balances.mjs";
import {tokenContract} from "./helpers/get-deployed-smart-contracts.mjs";

const run = async () => {

  const accounts = await getEthereumAccounts(web3);

  getTokenBalance(tokenContract, accounts[0], accounts[0])
    .then((balance) => {
      console.log("Account 0 has balance " + balance);
    });

  getTokenBalance(tokenContract, accounts[1], accounts[1])
    .then((balance) => {
      console.log("Account 1 has balance " + balance);
    });

  getTokenBalance(tokenContract, accounts[2], accounts[2])
    .then((balance) => {
      console.log("Account 2 has balance " + balance);
    });

  await tokenContract.methods.transfer(accounts[2], 500)
    .send({
      from: accounts[1],
      gas: 80000000
    })
    .then(() => {
      console.log("500 tokens transferred from account 1 to account 2")
    });

  getTokenBalance(tokenContract, accounts[0], accounts[0])
    .then((balance) => {
      console.log("Account 0 has balance " + balance);
    });

  getTokenBalance(tokenContract, accounts[1], accounts[1])
    .then((balance) => {
      console.log("Account 1 has balance " + balance);
    });

  getTokenBalance(tokenContract, accounts[2], accounts[2])
    .then((balance) => {
      console.log("Account 2 has balance " + balance);
    });







};

run();