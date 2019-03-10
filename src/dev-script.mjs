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

  // transferPreSignedHashing from Utils.sol
  // function transferPreSignedHashing(address _token, address _to, uint256 _value, uint256 _fee, uint256 _nonce)
  //   return keccak256(abi.encode(bytes4(0x15420b71), _token, _to, _value, _fee, _nonce));
  let input = web3.eth.abi.encodeParameters(
    ['bytes4','address','address','uint256','uint256','uint256'],
    // ['0x15420b71', '0x2E535479c6865E46A688D4C845E28613c6925fEe', accounts[2], '500', '5', '0']);
    ['0x15420b71',
      tokenContract.options.address,
      accounts[2], '500', '5', '0']);
  console.log(input);

  let toSignHexString = web3.utils.keccak256(input);
  console.log(toSignHexString);
  let message = await web3.eth.accounts.sign(toSignHexString,
  "0x3d63b5b61cc9636a143f4d2c56a9609eb459bc2f8f168e448b65f218893fef9f");
  console.log(web3.eth.accounts.recover(toSignHexString, message.signature));

  let eventSig;
  let hashedTx;
  let from;

  await tokenContract.methods.transferPreSigned(message.signature, accounts[2], 500, 5, 0)
    .send({
      from: accounts[0],
      gas: 80000000
    })
    .then((receipt) => {
      console.log("transferPreSigned call successful");
      eventSig = receipt.events.Signature.returnValues._signature;
      hashedTx = receipt.events.Signature.returnValues.hashedTx;
      from = receipt.events.Signature.returnValues.from;
    });

  console.log(eventSig === message.signature);
  console.log(hashedTx === toSignHexString);
  console.log(from === accounts[1]);
  console.log(from);
  console.log(accounts[1]);
};

run();