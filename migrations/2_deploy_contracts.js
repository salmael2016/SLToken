const SLToken = artifacts.require("SLToken");

module.exports = function(deployer) {
  deployer.deploy(SLToken);
};
