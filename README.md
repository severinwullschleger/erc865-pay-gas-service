# ERC-865 pay gas service

The author of this service is Severin Wullschleger.






#### Starting parity dev chain
Unlocking more than one address:
```
sudo parity --config dev --geth --unlock "0x00a329c0648769a73afac7f9381e08fb43dbea72" --password ./parity-empty-pw.txt --jsonrpc-hosts any --jsonrpc-apis eth,net,private,parity,personal --ws-apis eth,net,private,parity,personal --jsonrpc-cors https://remix.ethereum.org
```
,"0x25fc28613d205f3c9ae0937827Ff6Ab07754e53a","0x7b9A6bf86BB7317DF7562106eCc45ad49acFaAeb","0x8C5D1Ad4BdA1AF6b93E027859c7424C65251F838","0xD420bd920789B19539316d1144B63539CD059152"

Enable unlocking with --geth flag
```
sudo parity --config dev --geth --unlock 0x00a329c0648769a73afac7f9381e08fb43dbea72 --password ./parity-empty-pw.txt --jsonrpc-hosts any --jsonrpc-apis eth,net,private,parity,personal --ws-apis eth,net,private,parity,personal --jsonrpc-cors https://remix.ethereum.org
```

(The password file includes an empty line.)

#### Connect remix with localhost
```
remixd -s ~/Documents/GitHub/erc865-pay-gas-service/src/smartcontracts/contracts --remix-ide https://remix.ethereum.org
```


### Notes during developement:
* Problems with signing method of web3.js: It includes a hashing, which is not done in the ERC-865 token contracts. This leaded to different hashes and therefore different values.
* Not identical signature leaded to "random" address. Therefore a checking if from address is the same was included.
* The ERC-865 token contract (DOS token) always passes the from and the value parameter to the service contract. Therefore not every method of a contract can be called. Only the ones whose first parameters are _from (address) and _value (uint256)


This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
