import path from 'path';
import fs from 'fs';

const DIR_NAME = path.resolve(path.dirname(''));

export const getSmartContracts = () => {
    return {
      libraries: {
        language: 'Solidity',
        sources: {
          'Utils.sol': {
            content:
              fs.readFileSync(path.resolve(DIR_NAME, 'src/smartcontracts/contracts/Utils.sol'), 'utf-8')
          }
          ,
          'SafeMath.sol': {
            content:
              fs.readFileSync(path.resolve(DIR_NAME, 'src/smartcontracts/contracts/SafeMath.sol'), 'utf-8')
          }
        },
        settings: {
          outputSelection: {
            '*': {
              '*': ['*']
            }
          }
        }
      },
      contract: {
        language: 'Solidity',
        sources: {
          // 'DOS.sol': {
          //   content:
          //     fs.readFileSync(path.resolve(DIR_NAME, 'src/smartcontracts/contracts/DOS.sol'), 'utf-8')
          // }
          // ,
          // 'EurekaPlatform.sol': fs.readFileSync(
          //   path.resolve(
          //     DIR_NAME,
          //     'src/smartcontracts/contracts/EurekaPlatform.sol'
          //   ),
          //   'utf-8'
          // )
        },
        settings: {
          outputSelection: {
            '*':
              {
                '*':
                  ['*']
              }
          }
        }
      }
    }
  }
;

export function findImports(filePath) {
  if (filePath === 'Utils.sol')
    return {
      contents:
        fs.readFileSync(path.resolve(DIR_NAME, 'src/smartcontracts/contracts/Utils.sol'), 'utf-8')
    };
  else if (filePath === 'SafeMath.sol')
    return {
      contents:
        fs.readFileSync(path.resolve(DIR_NAME, 'src/smartcontracts/contracts/SafeMath.sol'), 'utf-8')
    };
  else
    return {error: 'File not found'};
}

export default getSmartContracts;
