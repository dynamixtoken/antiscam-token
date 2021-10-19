const Contract = artifacts.require("DynamixMission");
const MissionAmount = web3.utils.toWei("10.3", "ether");

// ------------- Buyer create mission -------------------
contract('Buyer create mission', (accounts) => {
  it('Mission is created correctly', async () => {
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
    assert.equal(Buyer.tg, "@johnSmith");
	
    assert.equal(Seller.name, "Captain Marvel");
    assert.equal(Seller.wallet, accounts[2]);
    assert.equal(Seller.tg, "@captainMarvel");
  });
});

// ------------- Buyer create mission, finance it and then cancel it -------------------
contract('Buyer create mission, finance it and then cancel it', (accounts) => {
  it('Buyer create and finance mission', async () => {
    const c = await Contract.deployed();
	await c.financeMission({ from: accounts[1], value: MissionAmount });
	
	const BuyerHasFundedMission = await c.BuyerHasFundedMission.call();

    assert.equal(BuyerHasFundedMission, true);
  });
  
  it('Buyer Wallet paid the mission + fees', async () => {
	var balance = await web3.eth.getBalance(accounts[1]);

	var b = web3.utils.fromWei(balance);
    assert.ok(b > 89.699);
    assert.ok(b < 90);
  });
  
  it('Smart Contract has the right mission amount', async () => {
	const c = await Contract.deployed();
  	var balance = await web3.eth.getBalance(c.address);

    assert.equal(balance, "10300000000000000000");
  });

  it('Buyer can cancel mission, because Seller did not accept', async () => {
    const c = await Contract.deployed();
	
	await c.cancelMission({ from: accounts[1] });
	const BuyerHasCanceledMission = await c.BuyerHasCanceledMission.call();

	assert.equal(BuyerHasCanceledMission, true);
  });  
  
  it('Smart Contract has 0 BNB', async () => {
	const c = await Contract.deployed();
  	var balance = await web3.eth.getBalance(c.address);

    assert.equal(balance, 0);
  });
  
  it('Fees has the right amount', async () => {
	var balance = await web3.eth.getBalance("0x34A1a24BB6C8a692e6F5f7650C89bd88cB51A28d");
	
    assert.equal(balance, "50000000000000000");
  });
  
  it('Buyer Wallet is refunded', async () => {
	var balance = await web3.eth.getBalance(accounts[1]);

	var b = web3.utils.fromWei(balance);
    assert.ok(b > 99.949);
  });
});

// ------------- Buyer create mission, finance it, Seller Accept and giveup it and then buyer can cancel it -------------------
contract('Buyer create mission, finance it, Seller Accept and giveup it and then buyer can cancel it', (accounts) => {
  it('Buyer create and finance mission', async () => {
    const c = await Contract.deployed();
	await c.financeMission({ from: accounts[1], value: MissionAmount });
	
	const BuyerHasFundedMission = await c.BuyerHasFundedMission.call();

    assert.equal(BuyerHasFundedMission, true);
  });
  
  it('Seller accept the mission and then give up', async () => {
    const c = await Contract.deployed();
	
	await c.acceptMission({ from: accounts[2] });
	await c.giveUpMission({ from: accounts[2] });
	
	const SellerHasAcceptedMission = await c.SellerHasAcceptedMission.call();

	assert.equal(SellerHasAcceptedMission, false);
  });

  it('Buyer can cancel mission, because Seller give up it', async () => {
    const c = await Contract.deployed();
	
	await c.cancelMission({ from: accounts[1] });
	const BuyerHasCanceledMission = await c.BuyerHasCanceledMission.call();

	assert.equal(BuyerHasCanceledMission, true);
  });  
  
  it('Smart Contract has 0 BNB', async () => {
	const c = await Contract.deployed();
  	var balance = await web3.eth.getBalance(c.address);

    assert.equal(balance, 0);
  });
  
  it('Fees has the right amount', async () => {
	var balance = await web3.eth.getBalance("0x34A1a24BB6C8a692e6F5f7650C89bd88cB51A28d");
	
    assert.equal(balance, "50000000000000000");
  });
  
  it('Buyer Wallet is refunded', async () => {
	var balance = await web3.eth.getBalance(accounts[1]);

	var b = web3.utils.fromWei(balance);
    assert.ok(b > 99.949);
  });
});

// ------------- Seller can\'t finance Mission -------------------
contract('Seller can\'t finance mission', (accounts) => {
  it('Buyer create mission', async () => {
    const c = await Contract.deployed();
  });
  
  it('Seller can\'t finance mission', async () => {
    const c = await Contract.deployed();
	
	try {
		await c.financeMission({ from: accounts[2], value: MissionAmount });
		assert.equal(true, false);
	} 
	catch (error) {
		
	}

	const BuyerHasFundedMission = await c.BuyerHasFundedMission.call();

	assert.equal(BuyerHasFundedMission, false);
  });
});

// ------------- Buyer can\'t accept Mission -------------------
contract('Buyer can\'t accept mission', (accounts) => {
  it('Buyer Create Mission', async () => {
    const c = await Contract.deployed();
  });
  
  it('Buyer can\'t accept Mission', async () => {
    const c = await Contract.deployed();
	
	try {
		await c.acceptMission({ from: accounts[1] });
		assert.equal(true, false);
	} 
	catch (error) {
		
	}

	const SellerHasAcceptedMission = await c.SellerHasAcceptedMission.call();

	assert.equal(SellerHasAcceptedMission, false);
  });
});

// ------------- Buyer can\'t give up Mission -------------------
contract('Buyer can\'t give up mission', (accounts) => {
  it('Buyer Create Mission', async () => {
    const c = await Contract.deployed();
	await c.financeMission({ from: accounts[1], value: MissionAmount });
	await c.acceptMission({ from: accounts[2] });

  });
  
  it('Buyer can\'t give up Mission', async () => {
    const c = await Contract.deployed();
	
	try {
		await c.giveUpMission({ from: accounts[1] });
		assert.equal(true, false);
	} 
	catch (error) {
		
	}
  });
});

// ------------- Buyer create mission, finance it. Seller accept it and then Buyer can\'t cancel it -------------------
contract('Buyer create mission, finance it. Seller accept it and then Buyer can\'t cancel it', (accounts) => {
  it('Buyer create and finance mission', async () => {
    const c = await Contract.deployed();
	await c.financeMission({ from: accounts[1], value: MissionAmount });
	
	const BuyerHasFundedMission = await c.BuyerHasFundedMission.call();

    assert.equal(BuyerHasFundedMission, true);
  });
  
  it('Seller accept the mission', async () => {
    const c = await Contract.deployed();
	
	await c.acceptMission({ from: accounts[2] });
	
	const SellerHasAcceptedMission = await c.SellerHasAcceptedMission.call();

	assert.equal(SellerHasAcceptedMission, true);
  });
  
  it('Buyer can\'t cancel the mission, because Seller already accepted it', async () => {
    const c = await Contract.deployed();
		
	try {
		await c.cancelMission({ from: accounts[1] });
		assert.equal(true, false);
	}
	catch {
		
	}
	
	const BuyerHasCanceledMission = await c.BuyerHasCanceledMission.call();

	assert.equal(BuyerHasCanceledMission, false);
  });
  
  it('Smart Contract has the right mission amount', async () => {
	const c = await Contract.deployed();
  	var balance = await web3.eth.getBalance(c.address);

    assert.equal(balance, "10300000000000000000");
  });
});

// ------------- Buyer create mission, finance it. Seller accept it and then Buyer pay mission -------------------
contract('Buyer create mission, finance it. Seller accept it and then Buyer pay mission', (accounts) => {
  it('Buyer create and finance mission', async () => {
    const c = await Contract.deployed();
	await c.financeMission({ from: accounts[1], value: MissionAmount });
	
	const BuyerHasFundedMission = await c.BuyerHasFundedMission.call();

    assert.equal(BuyerHasFundedMission, true);
  });
  
  it('Seller accept the mission', async () => {
    const c = await Contract.deployed();
	
	await c.acceptMission({ from: accounts[2] });
	
	const SellerHasAcceptedMission = await c.SellerHasAcceptedMission.call();

	assert.equal(SellerHasAcceptedMission, true);
  });
  
  it('Buyer pay mission', async () => {
    const c = await Contract.deployed();
	await c.payMission({ from: accounts[1] });
	
	const BuyerHasPaidMission = await c.BuyerHasPaidMission.call();

	assert.equal(BuyerHasPaidMission, true);
  });  
  
  it('Smart Contract has 0 BNB', async () => {
	const c = await Contract.deployed();
  	var balance = await web3.eth.getBalance(c.address);

    assert.equal(balance, 0);
  });
  
  it('Seller Wallet is credited', async () => {
	var balance = await web3.eth.getBalance(accounts[2]);

	var b = web3.utils.fromWei(balance);
    assert.ok(b > 109.99);
  });
  
  it('Fees has the right amount', async () => {
	var balance = await web3.eth.getBalance("0x34A1a24BB6C8a692e6F5f7650C89bd88cB51A28d");
	
    assert.equal(balance, "300000000000000000");
  });
});

// ------------- Buyer create mission, finance it. Seller can\'t pay mission -------------------
contract('Buyer create mission, finance it. Seller can\'t pay mission', (accounts) => {
  it('Buyer create and finance mission', async () => {
    const c = await Contract.deployed();
	await c.financeMission({ from: accounts[1], value: MissionAmount });
	
	const BuyerHasFundedMission = await c.BuyerHasFundedMission.call();

    assert.equal(BuyerHasFundedMission, true);
  });
  
  it('Seller can\'t call pay mission', async () => {
    const c = await Contract.deployed();
	
	try {
		await c.payMission({ from: accounts[2] });
		assert.equal(true, false);
	}
	catch {
		
	}
	
	const BuyerHasPaidMission = await c.BuyerHasPaidMission.call();

	assert.equal(BuyerHasPaidMission, false);
  });
  
});

// ------------- Buyer create mission, did not finance it. Buyer can\'t pay mission -------------------
contract('Buyer create mission, did not finance it. Buyer can\'t pay mission', (accounts) => {
  it('Buyer create mission', async () => {
    const c = await Contract.deployed();
  });
    
  it('Buyer can\'t pay mission, because it is not funded', async () => {
    const c = await Contract.deployed();
	
	try {
		await c.payMission({ from: accounts[1] });
		assert.equal(false, true);
	}
	catch {
		
	}
	
	const BuyerHasPaidMission = await c.BuyerHasPaidMission.call();

	assert.equal(BuyerHasPaidMission, false);
  });  
});

// ------------- Buyer create mission, finance it and then cancel it. Buyer can\'t pay mission -------------------
contract('Buyer create mission, finance it and then cancel it. Buyer can\'t pay mission', (accounts) => {
  it('Buyer create, finance and cancel mission', async () => {
    const c = await Contract.deployed();
	await c.financeMission({ from: accounts[1], value: MissionAmount });
	await c.cancelMission({ from: accounts[1] });
	
	const BuyerHasFundedMission = await c.BuyerHasFundedMission.call();
	const BuyerHasCanceledMission = await c.BuyerHasCanceledMission.call();

    assert.equal(BuyerHasFundedMission, false);
    assert.equal(BuyerHasCanceledMission, true);
  });
    
  it('Buyer can\'t pay mission, because it is canceled', async () => {
    const c = await Contract.deployed();
	
	try {
		await c.payMission({ from: accounts[1] });
		assert.equal(false, true);
	}
	catch {
		
	}
	
	const BuyerHasPaidMission = await c.BuyerHasPaidMission.call();

	assert.equal(BuyerHasPaidMission, false);
  });  
});

// ------------- Buyer create mission, cancel it and can\'t finance it -------------------
contract('Buyer create mission, cancel it and can\'t finance it', (accounts) => {
  it('Buyer create and cancel mission', async () => {
    const c = await Contract.deployed();
	await c.cancelMission({ from: accounts[1] });
	
	const BuyerHasFundedMission = await c.BuyerHasFundedMission.call();
	const BuyerHasCanceledMission = await c.BuyerHasCanceledMission.call();

    assert.equal(BuyerHasFundedMission, false);
    assert.equal(BuyerHasCanceledMission, true);
  });
    
  it('Buyer can\'t finance mission, because it is canceled', async () => {
    const c = await Contract.deployed();
	
	try {
		await c.financeMission({ from: accounts[1], value: MissionAmount });
		assert.equal(false, true);
	}
	catch {
		
	}
	
	const BuyerHasFundedMission = await c.BuyerHasFundedMission.call();

	assert.equal(BuyerHasFundedMission, false);  
  });
});

// ------------- Buyer create mission but not finance correctly -------------------
contract('Buyer create mission but not finance correctly', (accounts) => {
  it('Buyer create mission but not finance correctly', async () => {
    const c = await Contract.deployed();
	const Amount = web3.utils.toWei("10", "ether");

	try {
		await c.financeMission({ from: accounts[1], value: Amount });
		assert.equal(false, true);
	}
	catch {
		
	}
	
	const BuyerHasFundedMission = await c.BuyerHasFundedMission.call();
	const isFunded = await c.isFunded();

    assert.equal(BuyerHasFundedMission, false);
    assert.equal(isFunded, false);
  });  
});

// ------------- Buyer create mission, finance it. Seller accept it. Buyer call moderator, and moderator refund him -------------------
contract('Buyer create mission, finance it. Seller accept it. Buyer call moderator, and moderator refund him', (accounts) => {
  it('Buyer create and finance mission, seller accept the mission', async () => {
    const c = await Contract.deployed();
	await c.financeMission({ from: accounts[1], value: MissionAmount });
	await c.acceptMission({ from: accounts[2] });

	const BuyerHasFundedMission = await c.BuyerHasFundedMission.call();
	const SellerHasAcceptedMission = await c.SellerHasAcceptedMission.call();

    assert.equal(BuyerHasFundedMission, true);
	assert.equal(SellerHasAcceptedMission, true);
  });
  
  it('Moderator refund Buyer', async () => {
    const c = await Contract.deployed();
	await c.mediation(100, { from: accounts[0] });
	
	const BuyerHasPaidMission = await c.BuyerHasPaidMission.call();

	assert.equal(BuyerHasPaidMission, true);
  });  
  
  it('Smart Contract has 0 BNB', async () => {
	const c = await Contract.deployed();
  	var balance = await web3.eth.getBalance(c.address);

    assert.equal(balance, 0);
  });
  
  it('Buyer Wallet is credited', async () => {
	var balance = await web3.eth.getBalance(accounts[1]);

	var b = web3.utils.fromWei(balance);
    assert.ok(b > 99.675);
  });
  
  it('Fees has the right amount', async () => {
	var balance = await web3.eth.getBalance("0x34A1a24BB6C8a692e6F5f7650C89bd88cB51A28d");
	
    assert.equal(balance, "300000000000000000");
  });
});

// ------------- Buyer create mission, finance it. Seller accept it. Seller call moderator, and moderator refund him -------------------
contract('Buyer create mission, finance it. Seller accept it. Seller call moderator, and moderator refund him', (accounts) => {
  it('Buyer create and finance mission, seller accept the mission', async () => {
    const c = await Contract.deployed();
	await c.financeMission({ from: accounts[1], value: MissionAmount });
	await c.acceptMission({ from: accounts[2] });

	const BuyerHasFundedMission = await c.BuyerHasFundedMission.call();
	const SellerHasAcceptedMission = await c.SellerHasAcceptedMission.call();

    assert.equal(BuyerHasFundedMission, true);
	assert.equal(SellerHasAcceptedMission, true);
  });
  
  it('Moderator refund Seller', async () => {
    const c = await Contract.deployed();
	await c.mediation(0, { from: accounts[0] });
	
	const BuyerHasPaidMission = await c.BuyerHasPaidMission.call();

	assert.equal(BuyerHasPaidMission, true);
  });  
  
  it('Smart Contract has 0 BNB', async () => {
	const c = await Contract.deployed();
  	var balance = await web3.eth.getBalance(c.address);

    assert.equal(balance, 0);
  });
  
  it('Seller Wallet is credited', async () => {
	var balance = await web3.eth.getBalance(accounts[2]);

	var b = web3.utils.fromWei(balance);
    assert.ok(b > 109.99);
  });
  
  it('Fees has the right amount', async () => {
	var balance = await web3.eth.getBalance("0x34A1a24BB6C8a692e6F5f7650C89bd88cB51A28d");
	
    assert.equal(balance, "300000000000000000");
  });
});

// ------------- Buyer create mission, finance it. Seller accept it. Moderator refund them -------------------
contract('Buyer create mission, finance it. Seller accept it. Call moderator, and moderator refund them', (accounts) => {
  it('Buyer create and finance mission, seller accept the mission', async () => {
    const c = await Contract.deployed();
	await c.financeMission({ from: accounts[1], value: MissionAmount });
	await c.acceptMission({ from: accounts[2] });

	const BuyerHasFundedMission = await c.BuyerHasFundedMission.call();
	const SellerHasAcceptedMission = await c.SellerHasAcceptedMission.call();

    assert.equal(BuyerHasFundedMission, true);
	assert.equal(SellerHasAcceptedMission, true);
  });
  
  it('Moderator refund Buyer and Seller (50/50)', async () => {
    const c = await Contract.deployed();
	await c.mediation(50, { from: accounts[0] });
	
	const BuyerHasPaidMission = await c.BuyerHasPaidMission.call();

	assert.equal(BuyerHasPaidMission, true);
  });  
  
  it('Smart Contract has 0 BNB', async () => {
	const c = await Contract.deployed();
  	var balance = await web3.eth.getBalance(c.address);

    assert.equal(balance, 0);
  });
  
  it('Buyer Wallet is credited', async () => {
	var balance = await web3.eth.getBalance(accounts[1]);

	var b = web3.utils.fromWei(balance);
    assert.ok(b > 94.699);
  });
  
  it('Seller Wallet is credited', async () => {
	var balance = await web3.eth.getBalance(accounts[2]);

	var b = web3.utils.fromWei(balance);
    assert.ok(b > 104.99);
  });
  
  it('Fees has the right amount', async () => {
	var balance = await web3.eth.getBalance("0x34A1a24BB6C8a692e6F5f7650C89bd88cB51A28d");
	
    assert.equal(balance, "300000000000000000");
  });
});