import React from 'react'
import {serviceContracts, tokenContracts} from "../../helpers/get-contracts.mjs";
import web3, {web3Provider} from "../../helpers/web3Instance.mjs"

export const Web3Context = React.createContext({
  web3,
  serviceContracts,
  tokenContracts,
  provider: web3Provider
});
