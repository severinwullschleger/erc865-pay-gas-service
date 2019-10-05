import GanacheServiceContractAddress from '../smartcontracts/constants/GanacheServiceContractAddress.json';
import GanacheTokenContractAddress from '../smartcontracts/constants/GanacheTokenContractAddress.json';
import config from "../config.json"
import web3 from "./web3Instance.mjs"

export let tokenContracts = [];
export let serviceContracts = [];


const setContracts = () => {

  if (tokenContracts.length === 0) {
    if (config.ethereumNetwork !== 'ganache' && config.ethereumNetwork !== 'parity') {

      tokenContracts = config.acceptedTokens.map(c => {
        return {
          ...c,
          contractObj: new web3.eth.Contract(c.abi, c.address)
        };
      });
      serviceContracts = config.serviceContracts.map(c => {
        return {
          ...c,
          contractObj: new web3.eth.Contract(c.abi, c.address)
        };
      });

    } else {

      tokenContracts = config.acceptedTokens.map(c => {
        return {
          ...c,
          address: GanacheTokenContractAddress,
          contractObj: new web3.eth.Contract(c.abi, GanacheTokenContractAddress)
        };
      });
      serviceContracts = config.serviceContracts.map(c => {
        return {
          ...c,
          address: GanacheServiceContractAddress,
          contractObj: new web3.eth.Contract(c.abi, GanacheServiceContractAddress)
        };
      });

    }
  }
};

setContracts();

