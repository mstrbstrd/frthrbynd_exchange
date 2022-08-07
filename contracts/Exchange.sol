// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./Token.sol";

contract Exchange {
    address public feeAccount;
    uint256 public feePercent;

    mapping(address => mapping(address => uint256)) public tokens;

    mapping(uint256 => _Order) public orders;

    uint256 public orderCount; // 0

    mapping(uint256 => bool) public orderCancelled;

    event Deposit(address token, address user, uint256 amount, uint256 balance);

    event Withdraw(
        address token,
        address user,
        uint256 amount,
        uint256 balance
    );

    event Order(
        uint256 id,
        address user,
        address tokenGet,
        uint256 amountGet,
        address tokenGive,
        uint256 amountGive,
        uint256 timestamp
    );

    event Cancel(
        uint256 id,
        address user,
        address tokenGet,
        uint256 amountGet,
        address tokenGive,
        uint256 amountGive,
        uint256 timestamp
    );

    // A way to model the Order
    struct _Order {
        // Attributes of an order
        uint256 id; // Unique identifier for order
        address user; // User who made the order
        address tokenGet; //Address of token they receive
        uint256 amountGet; // Amount they receive
        address tokenGive; // Address of token they will give
        uint256 amountGive; // Amount of token they will give
        uint256 timestamp; // When the order was created
    }

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

    ///////////////////////////////////
    // MAKE && CANCEL ORDERS
    ///////////////////////////////////

    function makeOrder(
        address _tokenGet,
        uint256 _amountGet,
        address _tokenGive,
        uint256 _amountGive
    ) public {
        // REQUIRE TOKEN BALANCE
        require(balanceOf(_tokenGive, msg.sender) >= _amountGive);
        // INSTANTIATE A NEW ORDER
        orderCount = orderCount + 1;

        orders[orderCount] = _Order(
            orderCount, // id
            msg.sender, // user
            _tokenGet, // tokenGet
            _amountGet, // amountGet
            _tokenGive, // tokenGive
            _amountGive, // amountGive
            block.timestamp // timestamp
        );

        // Emit event
        emit Order(
            orderCount,
            msg.sender,
            _tokenGet,
            _amountGet,
            _tokenGive,
            _amountGive,
            block.timestamp
        );
    }

    function cancelOrder(uint256 _id) public {
        // fetch the order
        _Order storage _order = orders[_id];

        // ensure the function caller is the owner of the order
        require(address(_order.user) == msg.sender);

        // order must exist
        require(_order.id == _id);

        // cancel the order
        orderCancelled[_id] = true;

        // emit the event
        emit Cancel(
            _order.id,
            msg.sender,
            _order.tokenGet,
            _order.amountGet,
            _order.tokenGive,
            _order.amountGive,
            block.timestamp
        );
    }
}
