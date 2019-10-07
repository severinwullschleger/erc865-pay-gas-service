import Network from './Network.js';

export const getAccounts =  web3 => {
	if (web3) {
		return web3.eth
			.getAccounts()
			.then(accounts => {
				return accounts;
			})
			.catch(err => {
				console.error('An error with getAccounts() occurred: ' + err);
				return null;
			});
	}
};

export const getBalance = async (web3, address) => {
	if (web3) {
		return web3.eth
			.getBalance(address)
			.then(balance => {
				return balance;
			})
			.catch(err =>
				console.error('An error with getBalance() occurred: ' + err)
			);
	}
};

export const getAllAccounts = async web3 => {
	const accounts = new Map();
	if (web3) {
		return web3.eth
			.getAccounts()
			.then(async addresses => {
				await Promise.all(
					addresses.map(async address => {
						const balance = await getBalance(web3, address);
						const ethBalance = web3.utils.fromWei(balance.toString());
						accounts.set(address, ethBalance);
					})
				);
				return accounts;
			})
			.catch(err => {
				console.error('An error with getAccounts() occurred: ' + err);
				return null;
			});
	}
};

export const getNetwork = async web3 => {
	if (web3) {
		const netId = await web3.eth.net.getId().then(netId => {
			return netId;
		});
		switch (netId.toString()) {
			case '1':
				console.log('Mainnet detected');
				return Network.MAIN;
			case '2':
				console.log('Morden test network detected.');
				return Network.MORDEN;
			case '3':
				console.log('Ropsten test network detected.');
				return Network.ROPSTEN;
			case '4':
				console.log('Rinkeby test network detected.');
				return Network.RINKEBY;
			case '42':
				console.log('Kovan test network detected.');
				return Network.KOVAN;
			case '5777':
				console.log('GANACHE test network detected.');
				return Network.GANACHE;
			default:
				console.log('Unknown network detected.');
				return Network.UNKNOWN;
		}
	}
};

export const signPrivateKey = async (web3, address, message) => {
	if (web3.utils.isAddress(address)) {
		return web3.eth.personal
			.sign(message, address)
			.then(signedKey => {
				return signedKey;
			})
			.catch(err => console.log(err));
	}
};
