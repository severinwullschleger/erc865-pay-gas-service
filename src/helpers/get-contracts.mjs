import GanacheServiceContractAddress from '../smartcontracts/constants/GanacheServiceContractAddress.json';
import GanacheTokenContractAddress from '../smartcontracts/constants/GanacheTokenContractAddress.json';
import Web3 from 'web3'
import config from "../config.json"

const web3 = new Web3();

export let tokenContracts = [];
export let serviceContracts = [];


const setContracts = () => {

  if (tokenContracts.length === 0) {
    if (config.ethereumNetwork !== 'ganache') {

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

