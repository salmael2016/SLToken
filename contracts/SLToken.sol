// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <=0.7.0;

contract SLToken{
    string public name = "SLToken";
    string public symbol="SLT";
    string public standard="SLToken v=1.0";
    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf;
    event Transfer(address indexed _from, address indexed _to, uint256 _value);

    constructor(uint256 _initialSupply) public{
        balanceOf[msg.sender]=_initialSupply;
        totalSupply = _initialSupply;
    }

    function transfer(address _to, uint256 _value) public returns (bool success){
        require(balanceOf[msg.sender] > _value);
        balanceOf[msg.sender]-=_value;
        balanceOf[_to]+=_value;
        emit Transfer(msg.sender,_to,_value);
        return true;        
    }
}
