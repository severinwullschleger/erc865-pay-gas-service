import fs from 'fs';
import {deployContracts} from './deploy-contracts.mjs';

/*
  deployContracts will deploy all libraries specified in the input file and once they
  get a valid Ethereum address, all the smart contracts gets also deployed.
  the method returns a web3 instance of the smart contract itself.
 */
export const deployContractsAndSaveAddressesAndABIs = async () => {
  const [eurekaTokenContract, eurekaPlatformContract] = await deployContracts();

  const fileNames = {
    eurekaPlatform: {
      addressPath: 'src/smartcontracts/constants/GanachePlatformContractAddress.json',
      abiPath: 'src/smartcontracts/constants/GanachePlatformContractABI.json',
      abi: JSON.stringify(eurekaPlatformContract._jsonInterface),
      address: JSON.stringify(eurekaPlatformContract.options.address)
    },
    eurekaToken: {
      addressPath: 'src/smartcontracts/constants/GanacheTokenContractAddress.json',
      abiPath: 'src/smartcontracts/constants/GanacheTokenContractABI.json',
      abi: JSON.stringify(eurekaTokenContract._jsonInterface),
      address: JSON.stringify(eurekaTokenContract.options.address)
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
  return [eurekaTokenContract, eurekaPlatformContract];
};


