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

        it("approves tokens for delegated transfer",function(){
            return SLToken.deployed().then(function(instance){
                SLTokenInstance=instance;
                return SLTokenInstance.approve.call(accounts[1],100);
            }).then(function(success){
                assert.equal(success,true,"returns true");
                return SLTokenInstance.approve(accounts[1],100);
            }).then(function(receipt){
                assert.equal(receipt.logs.length,1,"triggers one event");
                assert.equal(receipt.logs[0].event,"Approval","triggers one event");
                assert.equal(receipt.logs[0].args._owner,accounts[0],"logs the account the tokens are authorized by");
                assert.equal(receipt.logs[0].args._spender,accounts[1],"logs the account the tokens are authorized to");
                assert.equal(receipt.logs[0].args._value,100,"logs the transfer amount");
                return SLTokenInstance.allowance(accounts[0],accounts[1]);                
            }).then(function(allowance){
                assert.equal(allowance.toNumber(),100,"stores the allowance for delegated transfer");
            })
        })

        it("handles delegated token transfers",function(){
            return SLToken.deployed().then(function(instance){
                SLTokenInstance=instance;
                fromAccount=accounts[2];
                toAccount=accounts[3];
                spendingAccount=accounts[4];
                return SLTokenInstance.transfer(fromAccount,100,{from:accounts[0]});
            }).then(function(receipt){
                return SLTokenInstance.approve(spendingAccount,10,{from:fromAccount});              
            }).then(function(receipt){
                return SLTokenInstance.transferFrom(fromAccount,toAccount,10000,{from:spendingAccount});
            }).then(function(receipt){
                return SLTokenInstance.transferFrom(fromAccount,toAccount,20,{from:spendingAccount});
            }).then(assert.fail).catch(function(error){
                assert(error.message.indexOf('revert')>=0,"cannot transfer value larger than the approval");
                return SLTokenInstance.transferFrom.call(fromAccount,toAccount,10,{from:spendingAccount});
            }).then(function(success){
                assert.equal(success,true);
                return SLTokenInstance.transferFrom(fromAccount,toAccount,10,{from:spendingAccount});
            }).then(function(receipt){
                assert.equal(receipt.logs.length,1,"transfers delegated tokens");
                assert.equal(receipt.logs[0].args._from,fromAccount,"logs the from address");
                assert.equal(receipt.logs[0].args._to,toAccount,"logs the to address");
                assert.equal(receipt.logs[0].args._value,10,"logs the amount transferred")
                return SLTokenInstance.allowance(fromAccount,spendingAccount);
            }).then(function(allowance){
                assert.equal(allowance.toNumber(),0,"deducts the amount of delegated tokens");
                return SLTokenInstance.balanceOf(fromAccount);
            }).then(function(balanceOfFromAccount){
                assert.equal(balanceOfFromAccount.toNumber(),90,"deducts the amount of tokens transfered");
                return SLTokenInstance.balanceOf(toAccount);
            }).then(function(balanceOfToAccount){
                assert.equal(balanceOfToAccount.toNumber(),10,"adds the amount of tokens transferred");
            })
        })
    })
})