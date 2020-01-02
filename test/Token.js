const { expect } = require('chai');
const { ethers } = require('hardhat');

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe("Token", () => {
    let token;

    beforeEach(async () => {
        const Token = await ethers.getContractFactory('Token')
        token = await Token.deploy('FURTHER BEYOND COIN', 'FRTHR', '1000000')
    })

    describe('Deployment', () => {
        const name = 'FURTHER BEYOND COIN'
        const symbol = 'FRTHR'
        const decimals = '18'
        const totalSupply = tokens('1000000')
        
        it("has correct name..", async () => {
            expect(await token.name()).to.equal(name)
        })
    
        it("has correct symbol..", async () => {
            // Check that symbol is correct
            expect(await token.symbol()).to.equal(symbol)
        })
    
        it("has correct decimals..", async () => {
            // Check that symbol is correct
            expect(await token.decimals()).to.equal(decimals)
        })
    
        it("has correct totalSupply..", async () => {
            // Check that symbol is correct
            expect(await token.totalSupply()).to.equal(totalSupply)
        })

    })


})



