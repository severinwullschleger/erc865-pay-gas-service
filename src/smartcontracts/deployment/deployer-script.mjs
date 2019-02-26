import {deployContractsAndSaveAddressesAndABIs} from "./deploy-contracts-and-save.mjs";

const run = async () => {
  await deployContractsAndSaveAddressesAndABIs();
  process.exit();
};

run();