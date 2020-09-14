const SLToken = artifacts.require("SLToken");
const SLTokenSale = artifacts.require("SLTokenSale");

module.exports = function(deployer) {
  deployer.deploy(SLToken,1000000).then(function(){
    // The token Price is 0.001 Ether 
    var tokenPrice = 1000000000000000;
    return deployer.deploy(SLTokenSale,SLToken.address,tokenPrice);
  });
};
