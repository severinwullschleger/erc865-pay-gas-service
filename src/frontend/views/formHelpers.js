export const isServiceContractAddress = (serviceContracts, address) => {
  //TODO check online if it is a contract
  const addresses = serviceContracts.map(c => {
    return c.contractObj.options.address;
  });

  return addresses.includes(address);
}