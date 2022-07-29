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

    // Track Balances
    mapping(address => uint256) public balanceOf;

    mapping(address => mapping(address => uint256)) public allowance;

    // events
    event Transfer(address indexed from, address indexed to, uint256 value);

    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );

    // Send Tokens
    function transfer(address _to, uint256 _value)
        public
        returns (bool success)
    {
        // Require sender has enough tokens to send
        require(balanceOf[msg.sender] >= _value);

        _transfer(msg.sender, _to, _value);

        return true;
    }

    function _transfer(
        address _from,
        address _to,
        uint256 _value
    ) internal {
        require(_to != address(0));

        // deduct tokens from spender
        balanceOf[_from] = balanceOf[_from] - _value;
        // credit tokens to recipient
        balanceOf[_to] = balanceOf[_to] + _value;

        // emit Transfer
        emit Transfer(_from, _to, _value);
    }

    function approve(address _spender, uint256 _value)
        public
        returns (bool success)
    {
        require(_spender != address(0));
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) public returns (bool success) {
        // check approval
        require(_value <= balanceOf[_from]);
        require(_value <= allowance[_from][msg.sender]);

        // reset allowance
        allowance[_from][msg.sender] = allowance[_from][msg.sender] - _value;

        // spend tokens
        _transfer(_from, _to, _value);

        return true;
    }

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _totalSupply
    ) {
        name = _name;
        symbol = _symbol;
        totalSupply = _totalSupply * (10**decimals); // 1,000,000 x 10^18;
        balanceOf[msg.sender] = totalSupply;
    }
}
