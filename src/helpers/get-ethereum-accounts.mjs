const getEthereumAccounts = async (web3) => {
  return web3.eth
    .getAccounts()
    .then(accounts => {
      return accounts;
    })
    .catch(err => console.log(err));
};

export default getEthereumAccounts;
