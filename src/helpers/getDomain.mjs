import {isProduction} from './isProduction.mjs';

export const getDomain = () => {
  if (isProduction()) {
    return 'https://pay-gas-service.herokuapp.com';
  }
  return 'http://localhost:8080';
};
