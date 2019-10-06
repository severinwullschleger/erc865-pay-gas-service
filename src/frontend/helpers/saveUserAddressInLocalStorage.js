export const upsertFromAddressesLocalStorage = fromAddress => {
  let fromAddresses = JSON.parse(localStorage.getItem("fromAddresses"));
  if (!fromAddresses) {
    fromAddresses = [];
    fromAddresses.push(fromAddress);
  } else {
    if (!fromAddresses.includes(fromAddress)) {
      fromAddresses.push(fromAddress);
    }
  }
  localStorage.setItem("fromAddresses", JSON.stringify(fromAddresses));
};
