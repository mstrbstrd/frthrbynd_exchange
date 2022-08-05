// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./Token.sol";

contract Exchange {
    address public feeAccount;
    uint256 public feePercent;

    mapping(address => mapping(address => uint256)) public tokens;

    event Deposit(address token, address user, uint256 amount, uint256 balance);

    event Withdraw(
        address token,
        address user,
        uint256 amount,
        uint256 balance
    );

    constructor(address _feeAccount, uint256 _feePercent) {
        feeAccount = _feeAccount;
        feePercent = _feePercent;
    }

    ////////////////////////////////////
    // DEPOSIT & WITHDRAW TOKEN ///////
    //////////////////////////////////

    function depositToken(address _token, uint256 _amount) public {
        // Transfer tokens to the exchange
        require(Token(_token).transferFrom(msg.sender, address(this), _amount));
        // update the user balance
        tokens[_token][msg.sender] = tokens[_token][msg.sender] + _amount;
        // emit an event
        emit Deposit(_token, msg.sender, _amount, tokens[_token][msg.sender]);
    }

    function withdrawToken(address _token, uint256 _amount) public {
        // ensure user has tokens to withdraw
        require(tokens[_token][msg.sender] >= _amount);
        // Transfer tokens to the user
        Token(_token).transfer(msg.sender, _amount);
        // Update the user balance
        tokens[_token][msg.sender] = tokens[_token][msg.sender] - _amount;
        // Emit an event
        emit Withdraw(_token, msg.sender, _amount, tokens[_token][msg.sender]);
    }

    // Check Balances
    function balanceOf(address _token, address _user)
        public
        view
        returns (uint256)
    {
        return tokens[_token][_user];
    }
}
