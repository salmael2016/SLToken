const SLTokenSale = artifacts.require("./SLTokenSale.sol");

contract("SLTokenSale",function(accounts){
    var tokenSaleInstance;
    var tokPrice = 1000000000000000;
    it("Deploys the contract and sets the variables",function(){
        return SLTokenSale.deployed().then(function(instance){
            tokenSaleInstance=instance;
            return tokenSaleInstance.address;
        }).then(function(addr){
            assert.notEqual(addr,"0x0","has a contract address");
            return tokenSaleInstance.slToken();
        }).then(function(tokenAddr){
            assert.notEqual(tokenAddr,"0x0","get the Token contract address");
            return tokenSaleInstance.tokenPrice();
        }).then(function(price){
            tokenPrice = price;
            assert.equal(tokenPrice,tokPrice,"Sets the token Price")
        })
    })
})