const Contract = artifacts.require("DynamixMission");

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
	await c.financeMission({ from: accounts[1] });
	
	const BuyerHasFundedMission = await c.BuyerHasFundedMission.call();

    assert.equal(BuyerHasFundedMission, true);
  });
  
  it('Buyer can cancel mission, because Seller did not accept', async () => {
    const c = await Contract.deployed();
	
	await c.cancelMission({ from: accounts[1] });
	const BuyerHasCanceledMission = await c.BuyerHasCanceledMission.call();

	assert.equal(BuyerHasCanceledMission, true);
  });  
});

// ------------- Buyer create mission, finance it, Seller Accept and giveup it and then buyer can cancel it -------------------
contract('Buyer create mission, finance it, Seller Accept and giveup it and then buyer can cancel it', (accounts) => {
  it('Buyer create and finance mission', async () => {
    const c = await Contract.deployed();
	await c.financeMission({ from: accounts[1] });
	
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
});

// ------------- Seller can\'t finance Mission -------------------
contract('Seller can\'t finance mission', (accounts) => {
  it('Buyer create mission', async () => {
    const c = await Contract.deployed();
  });
  
  it('Seller can\'t finance mission', async () => {
    const c = await Contract.deployed();
	
	try {
		await c.financeMission({ from: accounts[2] });
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
	await c.financeMission({ from: accounts[1] });
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
	await c.financeMission({ from: accounts[1] });
	
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
});

// ------------- Buyer create mission, finance it. Seller accept it and then Buyer pay mission -------------------
contract('Buyer create mission, finance it. Seller accept it and then Buyer pay mission', (accounts) => {
  it('Buyer create and finance mission', async () => {
    const c = await Contract.deployed();
	await c.financeMission({ from: accounts[1] });
	
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
});

// ------------- Buyer create mission, finance it. Seller can\'t pay mission -------------------
contract('Buyer create mission, finance it. Seller can\'t pay mission', (accounts) => {
  it('Buyer create and finance mission', async () => {
    const c = await Contract.deployed();
	await c.financeMission({ from: accounts[1] });
	
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
	await c.financeMission({ from: accounts[1] });
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
		await c.financeMission({ from: accounts[1] });
		assert.equal(false, true);
	}
	catch {
		
	}
	
	const BuyerHasFundedMission = await c.BuyerHasFundedMission.call();

	assert.equal(BuyerHasFundedMission, false);  
  });
});