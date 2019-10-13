const getEthereumAccounts = async web3 => {
  if (typeof window !== "undefined") {
    try {
      // Request account access if needed
      await window.ethereum.enable();
    } catch (error) {
      // User denied account access...
      console.log("the user has declined account access");
    }
  }
  return web3.eth
    .getAccounts()
    .then(accounts => {
      return accounts;
    })
    .catch(err => console.log(err));
};

export default getEthereumAccounts;
