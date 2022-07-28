require("@nomicfoundation/hardhat-toolbox");
// require("@nomicfoundation/hardhat-waffle"); --don't use this
require("@nomiclabs/hardhat-ethers");
require("dotenv").config();
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  networks: {
    localhost: {}
  },
};
