import solc from 'solc';
import web3 from '../../helpers/web3Instance.mjs';
import linker from 'solc/linker';
import getEthereumAccounts from '../../helpers/get-ethereum-accounts.mjs';
import getSmartContracts, {findImports} from './get-smart-contracts.mjs';


export const deployContracts = async () => {
  const accounts = await getEthereumAccounts(web3);
  if (web3) {
    let smartcontracts = getSmartContracts();
    const addressMap = await deployLibraries(smartcontracts.libraries, accounts);
    return deployContract(smartcontracts, addressMap, accounts);
  } else {
    console.log('Web3 Instance is not set!');
  }
};

export const deployContract = async (contractInput, addressMap, accounts) => {
  let input = {};
  // remove top level labels (libraries and contract)
  Object.keys(contractInput).forEach(key =>
    Object.assign(input, contractInput[key])
  );
  const compiledContract = solc.compile({sources: input}, 1);

  return Promise.all(
    Object.keys(contractInput.contract).map(async cName => {
      const web3Contract = getWeb3Contract(cName, compiledContract);
      let bytecode = web3Contract.options.data;
      const linkReferences = linker.findLinkReferences(bytecode);

      if (linkReferences) {
        // there is a library linked in the bytecode
        Object.keys(linkReferences).forEach(async link => {
          let libraryAddress = addressMap.get(link);

          if (libraryAddress) {
            let linkObj = {};
            linkObj[link] = libraryAddress; // example: { 'Utils.sol:Utils': '0x6EeCB98D711dbff3ceFD8F0619994BaBaCC3585b'}
            bytecode = linker.linkBytecode(bytecode, linkObj);
          }
        });
      }

      return deploy(web3Contract, bytecode, accounts, cName);
    })
  );
};

export const deployLibraries = async (librariesInput, accounts) => {
  const compiledLibraries = JSON.parse(solc.compile(JSON.stringify(librariesInput), findImports));
  console.log(compiledLibraries);
  let addressMap = new Map();
  await Promise.all(
    Object.keys(compiledLibraries.contracts).map(async libraryName => {
      const web3Contract = getWeb3Contract(libraryName, compiledLibraries.contracts[libraryName]);
      const bytecode = web3Contract.options.data;

      const contract = await deploy(
        web3Contract,
        bytecode,
        accounts,
        libraryName
      );
      let byteCodeLink =
        libraryName.toString() + ':' + libraryName.split('.')[0];
      addressMap.set(byteCodeLink, contract.options.address);
    })
  );
  return addressMap;
};

const getWeb3Contract = (cName, compiledContract) => {
  const pattern = cName.split('.')[0];
  const contract = compiledContract[pattern];
  console.log(contract);
  let web3Contract = new web3.eth.Contract(contract.abi);
  web3Contract.options.data = contract.bytecode;
  return web3Contract;
};

const deploy = async (web3Contract, bytecode, accounts, contractName) => {
  const gasEstimated = await web3.eth.estimateGas({data: bytecode});
  web3Contract.options.data = bytecode;
  // web3Contract.options.gas = gasEstimated;
  // web3Contract.options.from = accounts[0];
  return web3Contract
    .deploy()
    .send({
      from: accounts[0],
      gas: gasEstimated
    })
    .on('receipt', receipt => {
      web3Contract.options.address = receipt.contractAddress;
      console.log(
        'Smart contract "' +
          contractName +
          '" has been deployed and accepted in block number ' +
          receipt.blockNumber +
          ' (address: ' +
          receipt.contractAddress +
          ')'
      );
    });
};
