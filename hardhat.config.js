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
//0x7f5D656f3ACb0ccB7f46016f111658477e4cc371
module.exports = {
  networks: {
    goerli: {
      url: "https://arbitrum-goerli.infura.io/v3/4dc1418732704759aa363de02c17ca67",
      accounts: ["dc0e179b950ef6d8a1dd78ddb256de40da1544c236eb0e96e42c1df28780c04f"]
    }

  },
  etherscan: {
    apiKey: {
      arbitrumGoerli: 'Y74DTT9PAC3ZMXTS88J5IVKD6JME35Z2VT'
    }
  },
  solidity: "0.8.9"
}