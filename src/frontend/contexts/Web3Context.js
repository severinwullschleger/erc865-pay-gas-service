import React from 'react';
import Web3 from 'web3';
import Web3Providers from '../web3/Web3Providers.js';
import serviceABI from '../../smartcontracts/constants/GanacheServiceContractABI.json';
import {
  SERVICE_KOVAN_ADDRESS,
  TOKEN_KOVAN_ADDRESS
} from '../../smartcontracts/constants/KovanContractAddresses.mjs';
import tokenABI from '../../smartcontracts/constants/GanacheTokenContractABI.json';
import serviceAddress from '../../smartcontracts/constants/GanacheServiceContractAddress.json';
import tokenAddress from '../../smartcontracts/constants/GanacheTokenContractAddress.json';

const web3 = window.web3;
let web3Instance = null;
let serviceContract = null;
let tokenContract = null;
let provider;
if (typeof web3 !== 'undefined' && web3.currentProvider.isMetaMask) {
  // MetaMask as main provider
  console.info('MetaMask detected in this browser');
  web3Instance = new Web3(web3.currentProvider);
  provider = Web3Providers.META_MASK;
  serviceContract = new web3Instance.eth.Contract(
    serviceABI,
    SERVICE_KOVAN_ADDRESS
  );

  tokenContract = new web3Instance.eth.Contract(tokenABI, TOKEN_KOVAN_ADDRESS);
} else {
  web3Instance = new Web3('http://localhost:7545');
  serviceContract = new web3Instance.eth.Contract(serviceABI);
  tokenContract = new web3Instance.eth.Contract(tokenABI);
  serviceContract.options.address = serviceAddress;
  tokenContract.options.address = tokenAddress;
  provider = Web3Providers.LOCALHOST;
}

export const Web3Context = React.createContext({
  web3: web3Instance,
  serviceContract,
  tokenContract,
  provider
});
