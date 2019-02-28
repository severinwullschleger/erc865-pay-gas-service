import path from 'path';
import fs from 'fs';

const DIR_NAME = path.resolve(path.dirname(''));

export const getSmartContracts = () => {
  return {
    libraries: {
      'Utils.sol': fs.readFileSync(
        path.resolve(DIR_NAME, 'src/smartcontracts/contracts/Utils.sol'),
        'utf-8'
      ),
      'SafeMath.sol': fs.readFileSync(
        path.resolve(DIR_NAME, 'src/smartcontracts/contracts/SafeMath.sol'),
        'utf-8'
      )
    },
    contract: {
      'DOS.sol': fs.readFileSync(
        path.resolve(DIR_NAME, 'src/smartcontracts/contracts/DOS.sol'),
        'utf-8'
      )
      ,
      'EurekaPlatform.sol': fs.readFileSync(
        path.resolve(
          DIR_NAME,
          'src/smartcontracts/contracts/EurekaPlatform.sol'
        ),
        'utf-8'
      )
    }
  };
};

export default getSmartContracts;
