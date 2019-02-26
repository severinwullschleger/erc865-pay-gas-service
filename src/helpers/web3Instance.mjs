import Web3 from 'web3';
let web3;

const getWeb3Instance = () => {
  if (!web3)
    web3 = new Web3(getProvider());
};

const getProvider = () => {
  let provider;
  if (process.env.BC_NETWORK === 'main') {
    provider = new Web3.providers.WebsocketProvider('wss://infura.io/ws');
  }
  else if (process.env.BC_NETWORK === 'ganache') {
    provider = new Web3.providers.WebsocketProvider('ws://127.0.0.1:7545');
  }
  else if (process.env.BC_NETWORK === 'kovan') {
    provider = new Web3.providers.WebsocketProvider('ws://' + process.env.ETHEREUM_FULL_NODE_KOVAN);   //connecting to digital ocean ethereum-kovan-node
  }
  else {
    console.error('provider ' + process.env.BC_NETWORK + ' couldn\'t be found');
    process.exit(1);
  }
  provider.on('connect', (e) => {
    console.log('Web3 Provider connected to ' + web3.currentProvider.connection.url);
  });
  provider.on('error', e => {
    console.error('Web3 Provider Error', e);
    web3 = new Web3(getProvider());
  });
  provider.on('end', e => {
    console.error('Web3 Provider Ended', e);
    web3 = new Web3(getProvider());
  });
  return provider;
};

getWeb3Instance();
export default web3;
