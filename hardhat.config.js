require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-etherscan");
require("@solidstate/hardhat-bytecode-exporter");
require('hardhat-abi-exporter');
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
      accounts: ["6e3a4288130c72b420c4984034f9a7f343a985e3acd1114f0fc737af336fda3b"]
    },
    sepolia:{
      url: "https://sepolia.infura.io/v3/a8bd8f6354ff4900b1f319a7e2c737b9",
      accounts: ["6e3a4288130c72b420c4984034f9a7f343a985e3acd1114f0fc737af336fda3b"]
    }

  },
  etherscan: {
    apiKey: ""
  },
  solidity: "0.8.9"
}