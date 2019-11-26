import { getDomain } from "../../../helpers/getDomain.mjs";
import { getFromAddresses } from "../../helpers/saveUserAddressInLocalStorage.js";
import queryString from "query-string";

export const  getTransactions = () => {
  const addresses = queryString.stringify(
    { fromAddresses: JSON.parse(localStorage.getItem("fromAddresses")) },
    { arrayFormat: "comma" }
  );
  return fetch(`${getDomain()}/api/transactions?${addresses}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });
};

export const getTransaction = txHash => {
  return fetch(`${getDomain()}/api/transactions/${txHash}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });
};
