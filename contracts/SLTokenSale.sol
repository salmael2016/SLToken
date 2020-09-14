pragma solidity >=0.5.0 <=0.7.0;

import './SLToken.sol';
contract SLTokenSale{
    SLToken public slToken;
    address admin;
    uint256 public tokenPrice;

    constructor(SLToken _slToken, uint _tokenPrice) public {
        slToken = _slToken;
        admin = msg.sender;
        tokenPrice = _tokenPrice;
    }
}