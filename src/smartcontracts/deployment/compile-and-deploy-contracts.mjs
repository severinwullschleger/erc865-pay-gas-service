import solc from "solc";
import web3 from "../../helpers/web3Instance.mjs";
import linker from "solc/linker.js";
import getEthereumAccounts from "../../helpers/get-ethereum-accounts.mjs";
import getSmartContractInputs, {
  findImports
} from "./get-smart-contract-inputs.mjs";

export const compileAndDeployContracts = async () => {
  if (web3) {
    const compiledContracts = JSON.parse(
      solc.compile(JSON.stringify(getSmartContractInputs()), findImports)
    );

    return deployContracts(compiledContracts);
  } else {
    console.log("Web3 Instance is not set!");
  }
};

export const deployContracts = async compiledContracts => {
  const accounts = await getEthereumAccounts(web3);

  return Promise.all(
    Object.keys(getSmartContractInputs().sources).map(async cName => {
      const compiledContract =
        compiledContracts.contracts[cName][cName.replace(".sol", "")];

      // create web3 contract object
      const web3Contract = new web3.eth.Contract(compiledContract.abi);

      // deploy the contract
      return web3Contract.deploy({ data: "0x" + compiledContract.evm.bytecode.object })
        .send({
          from: accounts[0],
          gas: 8000000
        })
        .on("receipt", receipt => {
          web3Contract.options.address = receipt.contractAddress;
          console.log(
            'Smart contract "' +
            cName +
            '" has been deployed and accepted in block number ' +
            receipt.blockNumber +
            " (address: " +
            receipt.contractAddress +
            ")"
          );
        })
        .catch(error => {
          console.log('the deployment of', cName, 'was not successful. Error:', error )
        });
    })
  );
};
