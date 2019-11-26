import Web3 from "web3";
import Web3Providers from "../frontend/web3/Web3Providers.mjs";
import config from "../config.json";

let web3;
export let web3Provider;
const getWeb3Instance = () => {
  if (!web3) {
    web3 =
      typeof window !== "undefined"
        ? getFrontendWeb3()
        : new Web3(getBackendProvider());
  }
};

const getFrontendWeb3 = () => {
  // Modern dapp browsers...
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum);
    return window.web3;
  }
  // Legacy dapp browsers...
  else if (window.web3) {
    console.info("MetaMask detected in this browser");
    web3Provider = Web3Providers.META_MASK;
    return new Web3(window.web3.currentProvider);
  }
  // Non-dapp browsers...
  else {
    console.log(
      "Non-Ethereum browser detected. You should consider trying MetaMask!"
    );
    //this service does not need a provider, before: return new Web3('http://localhost:7545');
    web3Provider = Web3Providers.NO_PROVIDER;
    return new Web3();
  }
};

const getBackendProvider = () => {
  let protocol = "ws://";
  let fullNodeAddress = config.ethereumFullNodeAddress;

  if (!fullNodeAddress) {
    if (config.ethereumNetwork === "main") {
      fullNodeAddress = "infura.io/ws";
      protocol = "wss://";
    } else if (config.ethereumNetwork === "ganache") {
      fullNodeAddress = "127.0.0.1:7545";
    } else if (config.ethereumNetwork === "parity") {
      fullNodeAddress = "127.0.0.1:8546";
    }
  }
  console.log("Connecting to", protocol + fullNodeAddress);
  web3Provider = new Web3.providers.WebsocketProvider(protocol + fullNodeAddress);
  return web3Provider;
};

export const initializeWeb3 = () => {
  if (!web3) {
    web3 =
      typeof window !== "undefined"
        ? getFrontendWeb3()
        : new Web3(getBackendProvider());
  }
};

getWeb3Instance();
export default web3;
