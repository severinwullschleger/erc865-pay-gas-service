import fs from 'fs';
import {deployContracts} from './deploy-contracts.mjs';

/*
  deployContracts will deploy all libraries specified in the input file and once they
  get a valid Ethereum address, all the smart contracts gets also deployed.
  the method returns a web3 instance of the smart contract itself.
 */
export const deployContractsAndSaveAddressesAndABIs = async () => {
  const [tokenContract, serviceContract] = await deployContracts();

  const fileNames = {
    serviceContract: {
      addressPath: 'src/smartcontracts/constants/GanacheServiceContractAddress.json',
      abiPath: 'src/smartcontracts/constants/GanacheServiceContractABI.json',
      abi: JSON.stringify(serviceContract._jsonInterface),
      address: JSON.stringify(serviceContract.options.address)
    },
    tokenContract: {
      addressPath: 'src/smartcontracts/constants/GanacheTokenContractAddress.json',
      abiPath: 'src/smartcontracts/constants/GanacheTokenContractABI.json',
      abi: JSON.stringify(tokenContract._jsonInterface),
      address: JSON.stringify(tokenContract.options.address)
    }
  };

  await Promise.all(
    Object.keys(fileNames).map(contract => {
      fs.writeFileSync(
        fileNames[contract].abiPath,
        fileNames[contract].abi,
        function(err) {
          if (err) {
            return console.log(err);
          } else {
            console.log('ABI has been written in ' + contract.path);
          }
        }
      );

      fs.writeFileSync(
        fileNames[contract].addressPath,
        fileNames[contract].address,
        function(err) {
          if (err) {
            return console.log(err);
          } else {
            console.log('Address has been written in ' + contract.path);
          }
        }
      );
    })
  );
  return [tokenContract, serviceContract];
};


