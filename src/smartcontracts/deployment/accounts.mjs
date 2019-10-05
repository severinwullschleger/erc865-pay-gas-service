import getEthereumAccounts from "../../helpers/get-ethereum-accounts.mjs";
import web3 from "../../helpers/web3Instance.mjs";

export const makeSureToHaveAccounts = async numberOfAccounts => {
  const accounts = await getEthereumAccounts(web3);
  let length = accounts.length;

  while (length < numberOfAccounts) {
    let account = await web3.eth.personal.newAccount("");
    if (account !== "" && account !== "") {
      console.log("account created with address", account);
      length++;
    }
  }
};

export const unlockAllAccounts = async () => {
  const accounts = await getEthereumAccounts(web3);

  accounts.forEach(async address => {
    await web3.eth.personal
      .unlockAccount(address, "", "0x15180")  // 24 hours
      .then(console.log(address, "unlocked"))
      .catch(console.error);
  });
};
