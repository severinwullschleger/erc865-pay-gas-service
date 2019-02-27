import {SERVICE_MAIN_ADDRESS, TOKEN_MAIN_ADDRESS} from "../smartcontracts/constants/MainNetworkContractAddresses.mjs";
import {SERVICE_MAIN_ABI} from "../smartcontracts/constants/MainNetworkPlatformContractABIs.mjs";
import {TOKEN_MAIN_ABI} from "../smartcontracts/constants/MainNetworkTokenContractABIs.mjs";
import {SERVICE_KOVAN_ADDRESS, TOKEN_KOVAN_ADDRESS} from "../smartcontracts/constants/KovanContractAddresses.mjs";
import {SERVICE_KOVAN_ABI} from "../smartcontracts/constants/KovanPlatformContractABIs.mjs";
import {TOKEN_KOVAN_ABI} from "../smartcontracts/constants/KovanTokenContractABIs.mjs";
import GanacheServiceContractABI from '../smartcontracts/constants/GanacheServiceContractABI.json';
import GanacheServiceContractAddress from '../smartcontracts/constants/GanacheServiceContractAddress.json';
import GanacheTokenContractAddress from '../smartcontracts/constants/GanacheTokenContractAddress.json';
import GanacheTokenContractABI from '../smartcontracts/constants/GanacheTokenContractABI.json';
import web3 from "./web3Instance.mjs";

export let serviceContract;
export let tokenContract;

const setContracts = () => {

  if (!serviceContract || !tokenContract) {

    let serviceContractAddress;
    let serviceContractABI;
    let tokenContractAddress;
    let tokenContractABI;

    if (process.env.BC_NETWORK === 'main') {
      serviceContractAddress = SERVICE_MAIN_ADDRESS;
      serviceContractABI = SERVICE_MAIN_ABI;
      tokenContractAddress = TOKEN_MAIN_ADDRESS;
      tokenContractABI = TOKEN_MAIN_ABI;
    } else if (process.env.BC_NETWORK === 'ganache') {
      serviceContractAddress = GanacheServiceContractAddress;
      serviceContractABI = GanacheServiceContractABI;
      tokenContractAddress = GanacheTokenContractAddress;
      tokenContractABI = GanacheTokenContractABI;
    } else if (process.env.BC_NETWORK === 'kovan') {
      serviceContractAddress = SERVICE_KOVAN_ADDRESS;
      serviceContractABI = SERVICE_KOVAN_ABI;
      tokenContractAddress = TOKEN_KOVAN_ADDRESS;
      tokenContractABI = TOKEN_KOVAN_ABI;
    } else {
      console.error('BC_NETWORK ' + process.env.BC_NETWORK + ' couldn\'t be found');
      process.exit(1);
    }

    serviceContract = new web3.eth.Contract(serviceContractABI, serviceContractAddress);
    tokenContract = new web3.eth.Contract(tokenContractABI, tokenContractAddress);
  }
};

setContracts();

