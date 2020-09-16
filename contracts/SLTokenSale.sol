pragma solidity >=0.5.0 <=0.7.0;

import './SLToken.sol';
contract SLTokenSale{
    SLToken public slToken;
    address admin;
    uint256 public tokenPrice;
    uint256 public tokenSold;
    event BuyTokens(address _buyer,uint256 _amount);

    constructor(SLToken _slToken, uint _tokenPrice) public {
        slToken = _slToken;
        admin = msg.sender;
        tokenPrice = _tokenPrice;
    }
    function multiply(uint x, uint y) internal pure returns (uint z){
        require(y==0 || (z=x*y)/y==x);
    }
    function buyTokens(uint256 _numberOfTokens) public payable{
        require(msg.value == multiply(_numberOfTokens,tokenPrice));
        require(slToken.balanceOf(address(this)) >= _numberOfTokens);
        require(slToken.transfer(msg.sender,_numberOfTokens));
        tokenSold+=_numberOfTokens;
        emit BuyTokens(msg.sender,_numberOfTokens);
    }
}