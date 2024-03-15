require("@nomiclabs/hardhat-ethers");
require("@nomicfoundation/hardhat-toolbox");
const { alchemy_api, owner} = require("./server/config.js")

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  defaultNetwork: "hardhat",
  networks: {
     hardhat: {},
     polygon_mumbai: {
        url: alchemy_api.API_URL,
        accounts: [`0x${owner.PRIVATE_KEY}`]
     }
  },
  paths: {
    sources: "smart_contract/contracts",
    tests: "smart_contract/test",
    cache: "smart_contract/cache",
    artifacts: "smart_contract/artifacts"
  },
  mocha: {
    timeout: 40000
  }
};
