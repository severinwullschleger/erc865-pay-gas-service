import {deployContractsAndSaveAddressesAndABIs} from "./deploy-contracts-and-save.mjs";
import {finishMinting, mintTokens} from "../methods/token-minting.mjs";

const run = async () => {
  const [tokenContract, serviceContract] = await deployContractsAndSaveAddressesAndABIs();
  await mintTokens(tokenContract)
    .then(() =>{
      console.log('The EKA tokens have been minted.');
    });
  await finishMinting(tokenContract)
    .then(() => {
      console.log('The minting has been finished.');
    });
  process.exit();
};

run();