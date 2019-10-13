// call with await timeout(1000);
export const timeout = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};