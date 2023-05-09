require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-etherscan");
require('@symblox/hardhat-abi-gen');
require('@openzeppelin/hardhat-upgrades');
const {
  TASK_COMPILE,
} = require('hardhat/builtin-tasks/task-names');

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

//0x91D1B74421Bdd3030d44d5AFfdAe6279C4F8962b
module.exports = {
  networks: {
    cfx:{
      url:""
    },
    alfajores: {
      url: "https://alfajores-forno.celo-testnet.org",
      chainId: 44787
    },
    goerli: {
      url: "https://goerli.infura.io/v3/a8bd8f6354ff4900b1f319a7e2c737b9",
      accounts: [""]
    },
    sepolia:{
      url: "https://sepolia.infura.io/v3/a8bd8f6354ff4900b1f319a7e2c737b9",
      accounts: [""]
    }

  },
  etherscan: {
    apiKey: ""
  },
  solidity: "0.8.9"
}