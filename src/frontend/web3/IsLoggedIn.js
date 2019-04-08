import {MetaMaskStatus} from './MetaMaskStatus.js';

export const getMetaMaskStatus = async web3 => {
	if (web3) {
		return web3.eth
			.getAccounts()
			.then(accounts => {
				if (accounts.length === 0) {
					return MetaMaskStatus.DETECTED_NO_LOGGED_IN;
				} if (accounts.length === 1) {
					return MetaMaskStatus.DETECTED_LOGGED_IN;
				} if (accounts.length > 1) {
					// GANACHE
					return MetaMaskStatus.NO_DETECTED;
				}
			})
			.catch(err => {
				console.error('An error with getMetaMaskStatus() occurred: ' + err);
				return MetaMaskStatus.NO_DETECTED;
			});
	}
};
