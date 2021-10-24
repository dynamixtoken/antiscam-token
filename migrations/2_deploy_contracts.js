const DynamixMission = artifacts.require("DynamixMission");

module.exports = function(deployer, network, accounts) {
  var deadLine = ((new Date()).getTime() / 1000).toFixed() + 10000; 
  deployer.deploy(DynamixMission, accounts[1], "John Smith", "@johnSmith", accounts[2], "Captain Marvel", "@captainMarvel", "Save IronMan Life", "Can you save Iron Man ?", "10000000000000000000", deadLine);
};
