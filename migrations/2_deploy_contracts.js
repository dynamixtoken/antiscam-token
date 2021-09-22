const DynamixMission = artifacts.require("DynamixMission");

module.exports = function(deployer, network, accounts) {
  deployer.deploy(DynamixMission, accounts[1], "John Smith", accounts[2], "Captain Marvel", "Can you save Iron Man ?");
};
