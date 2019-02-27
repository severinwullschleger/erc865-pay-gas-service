export const getTokenBalance = async (tokenContract, account, fromAccount) => {
  return tokenContract.methods.balanceOf(account).call({
    from: fromAccount
  });
};