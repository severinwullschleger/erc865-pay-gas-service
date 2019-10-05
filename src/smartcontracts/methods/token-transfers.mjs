export const transferTokens = async (tokenContract, sender, receiver, amount) => {
  return tokenContract.methods.transferFrom(sender, receiver, amount).send({
    from: sender,
    gas: 8000000
  })
};

export const transferPreSigned = async (tokenContract, transactionSender, signature, receiver, amount, fee,
  nonce) => {
  return tokenContract.methods.transferPreSigned(signature, receiver, amount, fee, nonce).send({
    from: transactionSender,
    gas: 8000000
  })
};

