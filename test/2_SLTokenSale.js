const SLTokenSale = artifacts.require("./SLTokenSale.sol");
const SLToken = artifacts.require("./SLToken.sol");
contract("SLTokenSale",function(accounts){
    var tokenSaleInstance;
    var tokenInstance;
    var tokPrice = 1000000000000000;
    var numberOfTokens = 10;
    var buyer = accounts[1];
    var admin = accounts[0];
    var tokensAvailable = 750000;
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
        return SLToken.deployed().then(function(instance){
            tokenInstance=instance;
            return SLTokenSale.deployed();     
        }).then(function(instance){
            tokenSaleInstance=instance;
            return tokenInstance.transfer(tokenSaleInstance.address,tokensAvailable,{from : admin})   
        }).then(function(receipt){
            return tokenInstance.balanceOf(tokenSaleInstance.address);
        }).then(function(balance){
            assert.equal(balance,tokensAvailable,"has tokens");
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
            return tokenSaleInstance.buyTokens(80000000,{from : buyer, value : tokPrice * numberOfTokens});
        }).then(assert.fail).catch(function(error){
            assert(error.message.indexOf("revert")>=0,"cannot purchase more tokens than available");
        });
    })

    it("ends Sale",function(){
        return SLToken.deployed().then(function(instance){
            tokenInstance=instance;
            return SLTokenSale.deployed();
        }).then(function(instance){
            tokenSaleInstance=instance;
            return tokenSaleInstance.endSale({from:accounts[2]});
        }).then(assert.fail).catch(function(error){
            assert(error.message.indexOf('revert')>=0,"Only the admin could end the sale");
            return tokenSaleInstance.endSale({from:admin});
        }).then(function(receipt){
            return tokenInstance.balanceOf(admin);
        }).then(function(balance){
            assert.equal(balance.toNumber(),999990,"returns all unsold dapp tokens to admin")
            //return tokenSaleInstance.tokenPrice();
        //}).then(function(price){
        //    assert.equal(price.toNumber(),0,"reset the value of the token Price");
        })
    })
})