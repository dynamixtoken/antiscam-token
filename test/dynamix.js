const Contract = artifacts.require("DynamixMission");

contract('Dynamix Mission', (accounts) => {
  it('Buyer Create Mission', async () => {
    const c = await Contract.deployed();
	
	const MissionDescription = await c.Description.call();
	const CreationDate = await c.CreationDate.call();
	
	const BuyerHasCanceledMission = await c.BuyerHasCanceledMission.call();
	const BuyerHasFundedMission = await c.BuyerHasFundedMission.call();
	const BuyerHasPaidMission = await c.BuyerHasPaidMission.call();
	const SellerHasAcceptedMission = await c.SellerHasAcceptedMission.call();

	const Buyer = await c.Buyer.call();
	const Seller = await c.Seller.call();

    assert.equal(MissionDescription, "Can you save Iron Man ?");
	
    assert.equal(BuyerHasCanceledMission, false);
    assert.equal(BuyerHasFundedMission, false);
    assert.equal(BuyerHasPaidMission, false);
    assert.equal(SellerHasAcceptedMission, false);
	
    assert.ok(CreationDate != 0, "Can you save Iron Man ?");
	
    assert.equal(Buyer.name, "John Smith");
    assert.equal(Buyer.wallet, accounts[1]);
	
    assert.equal(Seller.name, "Captain Marvel");
    assert.equal(Seller.wallet, accounts[2]);
  });
  
  it('Buyer Finance Mission', async () => {
    const c = await Contract.deployed();
	
	await c.financeMission({ from: accounts[1] });
		
	const BuyerHasFundedMission = await c.BuyerHasFundedMission.call();

    assert.equal(BuyerHasFundedMission, true);
	// assert amount bnb
  });
  
  it('Buyer Pay Mission', async () => {
    const c = await Contract.deployed();
	
	await c.payMission({ from: accounts[1] });
		
	const BuyerHasPaidMission = await c.BuyerHasPaidMission.call();

    assert.equal(BuyerHasPaidMission, true);
  });
  
  it('Buyer Cancel Mission', async () => {
    const c = await Contract.deployed();
	
	
  });
  
  it('Buyer can\'t Cancel Mission, If Seller accepted Mission', async () => {
    const c = await Contract.deployed();
	
	
  });
  
  it('Seller can\'t Finance Mission', async () => {
    const c = await Contract.deployed();
	
	
  });
  
  it('Seller Accept Mission', async () => {
    const c = await Contract.deployed();
	
	
  });
});

/*
struct Wallet {
        address wallet; 
        string name;  
    }
	
	Wallet public Buyer;
	Wallet public Seller;

	string public Description;
	uint public CreationDate;
*/
