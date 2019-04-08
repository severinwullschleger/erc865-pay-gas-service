import Network from './Network.js';

export const getNetworkBase = network => {
  switch (network) {
    case Network.KOVAN:
      return 'https://kovan.etherscan.io';

    case Network.ROPSTEN:
      return 'https://ropsten.etherscan.io';

    case Network.MAIN:
      return 'https://etherscan.io';

    case Network.RINKEBY:
      return 'https://rinkeby.etherscan.io';

    default:
      return 'https://etherscan.io';
  }
};
