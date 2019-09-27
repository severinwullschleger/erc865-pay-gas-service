import { deployContractsAndSaveAddressesAndABIs } from "./deploy-contracts-and-save.mjs";
import {
  finishMinting,
  mintTokens,
  setAdmins
} from "../methods/token-minting.mjs";
import { makeSureToHaveAccounts, unlockAllAccounts } from "./accounts.mjs";

const run = async () => {
  const [
    tokenContract,
    serviceContract
  ] = await deployContractsAndSaveAddressesAndABIs();

  await makeSureToHaveAccounts(4);
  console.log("Node has four addresses now.");

  await unlockAllAccounts();
  console.log("accounts unlocked");

  await mintTokens(tokenContract)
    .then(() => {
      console.log("The DOS tokens have been minted.");
    })
    .catch(error => console.error(error));

  await setAdmins(tokenContract)
    .then(() => {
      console.log("Admins set.");
    })
    .catch(error => console.error(error));

  await finishMinting(tokenContract)
    .then(() => {
      console.log("The minting has been finished.");
    })
    .catch(error => console.error(error));
  process.exit();
};

run();