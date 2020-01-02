// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Token {
    // Token Name..
    string public name = "FURTHER BEYOND COIN";
    // Token Symbol..
    string public symbol = "FRTHR";
    // Token Decimals..
    uint256 public decimals = 18;
    // Token totalSupply..
    uint256 public totalSupply;

    // uint256 public totalSupply = 1000000 * (10**decimals); // 1,000,000 x 10^18;

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _totalSupply
    ) {
        name = _name;
        symbol = _symbol;
        totalSupply = _totalSupply * (10**decimals); // 1,000,000 x 10^18;
    }
}
