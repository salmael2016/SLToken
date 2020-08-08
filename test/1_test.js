const _deploy_contracts = require("../migrations/2_deploy_contracts");

const SLToken = artifacts.require('SLToken');

contract('SLToken',function(accounts){
    var SLTokenInstance;
    describe('variables are set correctly',function(){
        it('initializes the name',function(){
            return SLToken.deployed().then(function(instance){
                SLTokenInstance=instance;
                return SLTokenInstance.name();
            }).then(function(name){
                assert.equal(name,'SLToken','sets the name correctly');
                return SLTokenInstance.symbol();
            }).then(function(symbol){
                assert.equal(symbol,"SLT","sets the symbol correctly");
                return SLTokenInstance.standard();
            }).then(function(standard){
                assert.equal(standard,"SLToken v=1.0","Sets the standard correctly");
            })
        })
        it('sets totalSupply',function(){
            return SLToken.deployed().then(function(instance){
                SLTokenInstance=instance;
                return SLTokenInstance.totalSupply();
            }).then(function(totalSupply){
              assert.equal(totalSupply.toNumber(),1000000,'sets the totalSupply to 1M');
              return SLTokenInstance.balanceOf(accounts[0]);
            }).then(function(ownerBalance){
                assert.equal(ownerBalance.toNumber(),1000000,"Owner Accounts has 1M as Balance");
            })
        })

        it('transfers token ownership',function(){
            return SLToken.deployed().then(function(instance){
                SLTokenInstance=instance;
                return SLTokenInstance.transfer.call(accounts[1],99999999999999,{from:accounts[0]});
            }).then(assert.fail).catch(function(error){
                assert(error.message.indexOf('revert')>0,'error contains revert');
                return SLTokenInstance.transfer.call(accounts[1],250000,{from:accounts[0]});
            }).then(function(receipt){
                assert.equal(receipt,true,'returns success');
                return SLTokenInstance.transfer(accounts[1],250000,{from:accounts[0]});
            }).then(function(receipt){
                assert.equal(receipt.logs.length,1,"triggers one event");
                return SLTokenInstance.balanceOf(accounts[1]);
            }).then(function(receiverbalance){
                assert.equal(receiverbalance.toNumber(),250000,"adds balance to the receiver");
                return SLTokenInstance.balanceOf(accounts[0]);
            }).then(function(senderbalance){
                assert.equal(senderbalance.toNumber(),750000,"deducts balance of sender");
            })
        })
    })
})