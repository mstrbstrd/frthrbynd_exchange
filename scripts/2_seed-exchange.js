const { ethers } = require('hardhat')
const config = require('../src/config.json')

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether')
}

const wait = (seconds) => {
    const milliseconds = seconds * 1000
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

async function main() {
    
    let amount = tokens(10000)
    let transaction, result

    // Fetch accounts from wallet -- these are unlocked
    const accounts = await ethers.getSigners()

    // Fetch network
    const { chainId } = await ethers.provider.getNetwork()
    console.log("Using chainId: ", chainId)

    const frthr = await ethers.getContractAt('Token', config[chainId].FRTHR.address)
    console.log(`FRTHR Token fetched: ${frthr.address}\n`)

    const mETH = await ethers.getContractAt('Token', config[chainId].mETH.address)
    console.log(`mETH Token fetched: ${mETH.address}\n`)

    const mDAI = await ethers.getContractAt('Token', config[chainId].mDAI.address)
    console.log(`mDAI Token fetched: ${mDAI.address}\n`)

    // Fetch the deployed Exchange
    const exchange = await ethers.getContractAt('Exchange', config[chainId].exchange.address)
    console.log(`Exchange Fetched: ${exchange.address}\n`)

    // Give tokens to account[1]
    const sender = accounts[0]
    const receiver = accounts[1]


    // user1 transfers 10,000 mETH...
    transaction = await mETH.connect(sender).transfer(receiver.address, amount)
    console.log(`Transferred ${amount} tokens from ${sender.address} to ${receiver.address}\n`)

    // Set up exchange users
    const user1 = accounts[0]
    const user2 = accounts[1]

    // user1 approves 10,000 FRTHR...
    transaction = await frthr.connect(user1).approve(exchange.address, amount)
    await transaction.wait()
    console.log(`Approved ${amount} tokens from ${user1.address}\n`)

    // user1 deposits 10,000 FRTHR on exchange
    transaction = await exchange.connect(user1).depositToken(frthr.address, amount)
    await transaction.wait()
    console.log(`Deposited ${amount} FRTHR from ${user1.address}\n`)

    // user2 approves mETH
    transaction = await mETH.connect(user2).approve(exchange.address, amount)
    await transaction.wait()
    console.log(`Approved ${amount} tokens from ${user2.address}\n`)

    // user2 Depoits mETH on exchange
    transaction = await exchange.connect(user2).depositToken(mETH.address, amount)
    await transaction.wait()
    console.log(`Deposited ${amount} mETH from ${user2.address}\n`)

    ///////////////////////////////
    // Seed a Cancelled Order...
    //////////////////////////////
    
    // user1 makes an order to get tokens
    let orderId
    transaction = await exchange.connect(user1).makeOrder(mETH.address, tokens(100), frthr.address, tokens(5))
    result = await transaction.wait()
    console.log(`Made Order from ${user1.address}`)

    // user1 cancels the order
    orderId = result.events[0].args.id
    transaction = await exchange.connect(user1).cancelOrder(orderId)
    result = await transaction.wait()
    console.log(`Cancelled Order from ${user1.address}\n`)

    // Wait 1 second
    await wait(1)

    ///////////////////////////////
    // Seed Filled Orders...
    //////////////////////////////

    // user1 makes an order to get tokens
    transaction = await exchange.connect(user1).makeOrder(mETH.address, tokens(100), frthr.address, tokens(10))
    result = await transaction.wait()
    console.log(`Made Order from ${user1.address}`)

    // user2 fills order..
    orderId = result.events[0].args.id
    transaction = await exchange.connect(user2).fillOrder(orderId)
    result = await transaction.wait()
    console.log(`Filled order from ${user1.address}\n`)

    // Wait 1 second
    await wait(1)

    // user1 makes another order to get tokens
    transaction = await exchange.connect(user1).makeOrder(mETH.address, tokens(50), frthr.address, tokens(15))
    result = await transaction.wait()
    console.log(`Made Order from ${user1.address}`)

    // user2 fills another order..
    orderId = result.events[0].args.id
    transaction = await exchange.connect(user2).fillOrder(orderId)
    result = await transaction.wait()
    console.log(`Filled order from ${user1.address}\n`)

    // Wait 1 second
    await wait(1)

    // user1 makes a final order to get tokens
    transaction = await exchange.connect(user1).makeOrder(mETH.address, tokens(200), frthr.address, tokens(20))
    result = await transaction.wait()
    console.log(`Made Order from ${user1.address}`)

    // user2 fills final order..
    orderId = result.events[0].args.id
    transaction = await exchange.connect(user2).fillOrder(orderId)
    result = await transaction.wait()
    console.log(`Filled order from ${user1.address}\n`)

    // Wait 1 second
    await wait(1)

    ///////////////////////////////
    // Seed Open Orders...
    //////////////////////////////

    // user1 makes 10 orders
    for (let i = 1; i <= 10; i++) {
        transaction = await exchange.connect(user1).makeOrder(mETH.address, tokens(10 * i), frthr.address, tokens(10))
        result = await transaction.wait()

        console.log(`Made Order from ${user1.address}`)

        // Wait 1 second
        await wait(1)
    }

    // user2 makes 10 orders
    for (let i = 1; i <= 10; i++) {
        transaction = await exchange.connect(user2).makeOrder(frthr.address, tokens(10), mETH.address, tokens(10 * i))
        result = await transaction.wait()

        console.log(`Made Order from ${user2.address}`)

        // Wait 1 second
        await wait(1)
    }

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1);
    });