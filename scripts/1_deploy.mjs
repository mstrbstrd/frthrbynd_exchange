import pkg from 'hardhat';
const { ethers } = pkg;

async function main() {
    // get the contract to deploy
    const Token = await ethers.getContractFactory("Token");


    // deploy the contract
   const token = await Token.deploy();
   await token.deployed();
   console.log(`Token Deployed to: ${token.address}`);

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });