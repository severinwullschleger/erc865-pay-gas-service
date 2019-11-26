import path from "path";
import fs from "fs";

const DIR_NAME = path.resolve(path.dirname(""));

export const getSmartContractInputs = () => {
  return {
    // Required: Source code language, such as "Solidity", "serpent", "lll", "assembly", etc.
    language: "Solidity",
    // Required
    sources: {
      "CHFT.sol": {
        content: fs.readFileSync(
          path.resolve(DIR_NAME, "src/smartcontracts/contracts/CHFT.sol"),
          "utf-8"
        )
      },
      "TranslationService.sol": {
        content: fs.readFileSync(
          path.resolve(
            DIR_NAME,
            "src/smartcontracts/contracts/TranslationService.sol"
          ),
          "utf-8"
        )
      }
    },
    settings: {
      outputSelection: {
        "*": {
          "*": ["*"]
        }
      }
    }
  };
};

export const findImports = importPath => {
  if (importPath === "Utils.sol")
    return {
      contents: fs.readFileSync(
        path.resolve(DIR_NAME, "src/smartcontracts/contracts/Utils.sol"),
        "utf-8"
      )
    };
  else if (importPath === "SafeMath.sol")
    return {
      contents: fs.readFileSync(
        path.resolve(DIR_NAME, "src/smartcontracts/contracts/SafeMath.sol"),
        "utf-8"
      )
    };
  else return {error: "File not found"};
};

export default getSmartContractInputs;
