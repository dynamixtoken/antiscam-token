const DynamixMission = artifacts.require("DynamixMission");

module.exports = function(deployer, network, accounts) {
  deployer.deploy(DynamixMission, accounts[1], "John Smith", "@johnSmith", accounts[2], "Captain Marvel", "@captainMarvel", "Can you save Iron Man ?", "10000000000000000000");
};
