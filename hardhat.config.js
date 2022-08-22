require("@nomicfoundation/hardhat-toolbox");
// require("@nomicfoundation/hardhat-waffle"); --don't use this
require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

const privateKeys = process.env.PRIVATE_KEYS.split(',') || ""
const APIKey = process.env.INFURA_API_KEY || ""
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  networks: {
    localhost: {},
    kovan: {
      url: `https://kovan.infura.io/v3/${APIKey}`,
      accounts: privateKeys,
    }
  },
};

