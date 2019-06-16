import React from 'react';
import Web3 from 'web3';
import Web3Providers from '../web3/Web3Providers.js';
import {serviceContracts, tokenContracts} from "../../helpers/get-contracts.mjs";

const web3 = window.web3;
let web3Instance = null;
let serviceContract = serviceContracts[0].contractObj;
let tokenContract = tokenContracts[0].contractObj;
let provider;
if (typeof web3 !== 'undefined' && web3.currentProvider.isMetaMask) {
  // MetaMask as main provider
  console.info('MetaMask detected in this browser');
  web3Instance = new Web3(web3.currentProvider);
  provider = Web3Providers.META_MASK;
} else {
  //this service does not need a provider, before: web3Instance = new Web3('http://localhost:7545');
  web3Instance = new Web3();
  provider = Web3Providers.NO_PROVIDER;
}

export const Web3Context = React.createContext({
  web3: web3Instance,
  serviceContract,
  tokenContract,
  provider
});
