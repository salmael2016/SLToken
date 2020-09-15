const SLTokenSale = artifacts.require("./SLTokenSale.sol");

contract("SLTokenSale",function(accounts){
    var tokenSaleInstance;
    var tokPrice = 1000000000000000;
    var numberOfTokens = 10;
    var buyer = accounts[1];
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

    it("facilitates buy tokens",function(){
        return SLTokenSale.deployed().then(function(instance){
            tokenSaleInstance=instance;
            return tokenSaleInstance.buyTokens(numberOfTokens,{from : buyer, value : tokPrice * numberOfTokens});
        }).then(function(receipt){
            assert.equal(receipt.logs.length,1,"Logs one event");
            assert.equal(receipt.logs[0].event,"BuyTokens","logs buyTokens event")
            assert.equal(receipt.logs[0].args._buyer,buyer,"logs the buyer address");
            assert.equal(receipt.logs[0].args._amount,numberOfTokens,"logs the amount bought");
            return tokenSaleInstance.tokenSold();
        }).then(function(amount){
            assert.equal(amount,numberOfTokens,"increments the tokens Sold");
            return tokenSaleInstance.buyTokens(numberOfTokens,{from : buyer,value : 1});
        }).then(assert.fail).catch(function(error){
            assert(error.message.indexOf("revert")>=0,"msg.value must be equal to the number of tokens to buy multiplied by the token price");
        });
    })
})