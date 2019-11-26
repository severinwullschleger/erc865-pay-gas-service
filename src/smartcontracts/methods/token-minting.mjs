import getEthereumAccounts from "../../helpers/get-ethereum-accounts.mjs";
import web3 from "../../helpers/web3Instance.mjs";

export const mintTokens = async tokenContract => {
  const accounts = await getEthereumAccounts(web3);

  accounts.push("0x7b9A6bf86BB7317DF7562106eCc45ad49acFaAeb");

  const contractOwner = accounts[0];
  let tokenAmounts = [];
  accounts.forEach(() => {
    tokenAmounts.push(200000000);
  });

  return tokenContract.methods.mint(accounts, tokenAmounts).send({
    from: contractOwner,
    gas: 8000000
  });
};

export const setAdmins = async tokenContract => {
  const accounts = await getEthereumAccounts(web3);
  const contractOwner = accounts[0];
  return tokenContract.methods.setAdmin(accounts[0], accounts[1]).send({
    from: contractOwner,
    gas: 8000000
  });
};

export const finishMinting = async tokenContract => {
  const accounts = await getEthereumAccounts(web3);
  const contractOwner = accounts[0];
  return tokenContract.methods.finishMinting().send({
    from: contractOwner,
    gas: 8000000
  });
};
