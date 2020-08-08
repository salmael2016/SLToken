// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <=0.7.0;

contract SLToken{
    string public name = "SLToken";
    string public symbol="SLT";
    string public standard="SLToken v=1.0";
    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf;

    constructor(uint256 _initialSupply) public {
        balanceOf[msg.sender]=_initialSupply;
        totalSupply = _initialSupply;
    }
}