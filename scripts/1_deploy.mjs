import pkg from 'hardhat';
const { ethers } = pkg;

async function main() {
    console.log('Preparing deployment...\n')
    // get the contract to deploy
    const Token = await ethers.getContractFactory("Token");

    // get the exchange to deploy
    const Exchange = await ethers.getContractFactory('Exchange')

    // fetch accounts
    const accounts = await ethers.getSigners()

    console.log(`Accounts Fetched:\n ${accounts[0].address}\n ${accounts[1].address}\n`)


   // deploy the contracts
   const frthr = await Token.deploy('Further Beyond Coin', 'FRTHR', '1000000')
   await frthr.deployed();
   console.log(`FRTHR Deployed to: ${frthr.address}`)

   const mETH = await Token.deploy('Mock Ethereum', 'mETH', '1000000')
   await mETH.deployed();
   console.log(`mETH Deployed to: ${mETH.address}`)

   const mDAI = await Token.deploy('Mock DAI', 'mDAI', '1000000')
   await mDAI.deployed();
   console.log(`mDAI Deployed to: ${mDAI.address}`)

   const exchange = await Exchange.deploy(accounts[1].address, 10)
   await exchange.deployed()
   console.log(`Exchange Deployed To: ${exchange.address}`)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
