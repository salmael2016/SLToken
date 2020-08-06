const _deploy_contracts = require("../migrations/2_deploy_contracts");

const SLToken = artifacts.require('SLToken');

contract('SLToken',function(accounts){
    describe('variables are set correctly',function(){
        it('sets totalSupply',function(){
            return SLToken.deployed().then(function(instance){
                var SLTokenInstance=instance;
                return SLTokenInstance.totalSupply();
            }).then(function(totalSupply){
              assert.equal(totalSupply.toNumber(),1000000,'sets the totalSupply to 1M');
            })
        })
    })
})