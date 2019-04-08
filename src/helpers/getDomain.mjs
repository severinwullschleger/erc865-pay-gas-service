import {isProduction} from './isProduction.mjs';

export const getDomain = () => {
  if (isProduction()) {
    // TODO: insert prod url
    return '';
  }
  return 'http://localhost:8080';
};
