const { expect } = require("chai");
const { ethers } = require("hardhat");
const { currentTimeStamp } = require("../../server/config");

async function ready_mint(message){
  const [owner_1, owner_2] = await ethers.getSigners();
  const Token = await ethers.getContractFactory("FypToken");
  const FypToken = await Token.deploy();
  const signature = await owner_1.signMessage(message)
  const sig = ethers.utils.splitSignature(signature)

  const signature_2 = await owner_2.signMessage(message)
  const sig_2 = ethers.utils.splitSignature(signature_2)
  
  return [FypToken, owner_1, owner_2, sig, sig_2]
}

async function not_ready_mint(message){
  const [owner_1, owner_2] = await ethers.getSigners();
  const Token = await ethers.getContractFactory("FypToken");
  const FypToken = await Token.deploy();
  const signature = await owner_1.signMessage(message.concat('1234'))
  const sig = ethers.utils.splitSignature(signature)

  const signature_2 = await owner_2.signMessage(message)
  const sig_2 = ethers.utils.splitSignature(signature_2)
  
  return [FypToken, owner_1, owner_2, sig, sig_2]
}

async function event_listener(action, event_name){
  const rc = await action.wait(); 
  const event = rc.events.find(event => event.event === event_name);
  const [value] = event.args;
  return value; 
}



describe("Test isSigned()", function () {
  it("Both party signed correct signature on same document, return True", async function () {
    [FypToken, owner_1, owner_2, sig, sig_2] = await ready_mint('Random Message')

    const return_value = await FypToken.isSigned('Random Message', owner_1.address, sig.v, sig.r, sig.s, 
      owner_2.address, sig_2.v, sig_2.r, sig_2.s)

    expect(return_value).to.equal(true);
  });

  it("Both party signed correct signature but different document, return False", async function () {
    [FypToken, owner_1, owner_2, sig, sig_2] = await not_ready_mint('Random Message')


    const return_value = await FypToken.isSigned('Random Message', owner_1.address, sig.v, sig.r, sig.s, 
    owner_2.address, sig_2.v, sig_2.r, sig_2.s)

    expect(return_value).to.equal(false);
  });

  it("Incorrect signature for first party, return False", async function () {
    const [owner_1, owner_2] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("FypToken");
    const FypToken = await Token.deploy();

    const signature = await owner_1.signMessage('Dummy')
    const sig = ethers.utils.splitSignature(signature)

    const signature_2 = await owner_2.signMessage('Dummy+23432423')
    const sig_2 = ethers.utils.splitSignature(signature_2)

    const return_value = await FypToken.isSigned('Dummy+23432423', owner_1.address, sig.v, sig.r, sig.s, 
    owner_2.address, sig_2.v, sig_2.r, sig_2.s)

    expect(return_value).to.equal(false);
  });

  it("Incorrect signature for second party, return False", async function () {
    const [owner_1, owner_2] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("FypToken");
    const FypToken = await Token.deploy();

    const signature = await owner_1.signMessage('Dummy')
    const sig = ethers.utils.splitSignature(signature)

    const signature_2 = await owner_2.signMessage('halooo+34324324')
    const sig_2 = ethers.utils.splitSignature(signature_2)

    const return_value = await FypToken.isSigned('Dummy', owner_1.address, sig.v, sig.r, sig.s, 
    owner_2.address, sig_2.v, sig_2.r, sig_2.s)

    expect(return_value).to.equal(false);
    });
});



describe("Test mint()", function() {
  it("Not yet Signed, return 0", async function() {
    [FypToken, owner_1, owner_2, sig, sig_2] = await not_ready_mint('Random Message')

    const action = await FypToken.mint('', owner_1.address, sig.v, sig.r, sig.s, 
    owner_2.address, sig_2.v, sig_2.r, sig_2.s)

    const id = await event_listener(action,'return_uint256')

    expect(id.toNumber()).to.equal(0)
  });

  it("mint multiple NFT, tokeinId incremented ", async function() {
    [FypToken, owner_1, owner_2, sig, sig_2] = await ready_mint('Dummy')

    const action_1 = await FypToken.mint('Dummy', owner_1.address, sig.v, sig.r, sig.s, 
    owner_2.address, sig_2.v, sig_2.r, sig_2.s)
    const action_2 = await FypToken.mint('Dummy', owner_1.address, sig.v, sig.r, sig.s, 
    owner_2.address, sig_2.v, sig_2.r, sig_2.s)

    const id_1 = await event_listener(action_1,'return_uint256')
    const id_2 = await event_listener(action_2,'return_uint256')

    expect(id_1.toNumber()).to.equal(1) && expect(id_2.toNumber()).to.equal(2)
  });

  it("Signed, return NFT id with correct URI ", async function() {
    [FypToken, owner_1, owner_2, sig, sig_2] = await ready_mint('Dummy')

    const action = await FypToken.mint('Dummy', owner_1.address, sig.v, sig.r, sig.s, 
    owner_2.address, sig_2.v, sig_2.r, sig_2.s)
    const id = await event_listener(action,'return_uint256')
    
    const uri = await FypToken.tokenURI(id.toNumber())

    expect(uri).to.equal('Dummy')
  });

  it("Signed, return NFT with correct owner ", async function() {
    [FypToken, owner_1, owner_2, sig, sig_2] = await ready_mint('Dummy')

    const action = await FypToken.mint('Dummy', owner_1.address, sig.v, sig.r, sig.s, 
    owner_2.address, sig_2.v, sig_2.r, sig_2.s)
    const id = await event_listener(action,'return_uint256')
    
    const owner = await FypToken.ownerOf(id.toNumber())

    expect(owner).to.equal(owner_2.address)
  });

  it("Signed, _terminated set to 0 ", async function() {
    [FypToken, owner_1, owner_2, sig, sig_2] = await ready_mint('Dummy')

    const action = await FypToken.mint('Dummy', owner_1.address, sig.v, sig.r, sig.s, 
    owner_2.address, sig_2.v, sig_2.r, sig_2.s)
    const id = await event_listener(action,'return_uint256')
    
    const terminate_time = await FypToken.terminate_time(id.toNumber())

    expect(terminate_time).to.equal(0)
  });

  it("Signed, company_address set to company_address ", async function() {
    [FypToken, owner_1, owner_2, sig, sig_2] = await ready_mint('Dummy')

    const action = await FypToken.mint('Dummy', owner_1.address, sig.v, sig.r, sig.s, 
    owner_2.address, sig_2.v, sig_2.r, sig_2.s)
    const id = await event_listener(action,'return_uint256')
    
    const terminate_time = await FypToken.company_address(id.toNumber())

    expect(terminate_time).to.equal(owner_1.address)
  });
});



describe("Test terminate_time()", function() {
  it("return terminate time", async function() {
    const Token = await ethers.getContractFactory("FypToken");
    const FypToken = await Token.deploy();

    expect(await FypToken.terminate_time(1)).to.equal(0)
  });
});


describe("Test terminate()", function() {
  it("token not exist, return 0", async function() {
    [FypToken, owner_1, owner_2, sig, sig_2] = await ready_mint('10001234')

    const action = await FypToken.terminate(1000, sig.v, sig.r, sig.s)
    const return_value = await event_listener(action,'return_uint256')

    expect(return_value).to.equal(0)
  });

  it("terminated already, return 0", async function() {
    [FypToken, owner_1, owner_2, sig, sig_2] = await ready_mint('1')
    await FypToken.mint('1', owner_1.address, sig.v, sig.r, sig.s, 
    owner_2.address, sig_2.v, sig_2.r, sig_2.s)
    await FypToken.terminate(1, sig.v, sig.r, sig.s)
    
    const action = await FypToken.terminate(1, sig.v, sig.r, sig.s)
    const return_value = await event_listener(action,'return_uint256')

    expect(return_value).to.equal(0)
  });

  it("token exist, not terminated and signed by company , return timestamp", async function() {
    [FypToken, owner_1, owner_2, sig, sig_2] = await ready_mint('1')
    await FypToken.mint('1', owner_1.address, sig.v, sig.r, sig.s, 
    owner_2.address, sig_2.v, sig_2.r, sig_2.s)
    const action = await FypToken.terminate(1, sig.v, sig.r, sig.s)

    const return_value = await event_listener(action,'return_uint256')

    expect(Math.ceil(return_value/1000)).to.equal(Math.ceil(currentTimeStamp/1000))
  });

  it("token exist, not terminated and signed by owner, return timestamp", async function() {
    [FypToken, owner_1, owner_2, sig, sig_2] = await ready_mint('1')
    await FypToken.mint('1', owner_1.address, sig.v, sig.r, sig.s, 
    owner_2.address, sig_2.v, sig_2.r, sig_2.s)
    const action = await FypToken.terminate(1, sig_2.v, sig_2.r, sig_2.s)

    const return_value = await event_listener(action,'return_uint256')

    expect(Math.ceil(return_value/1000)).to.equal(Math.ceil(currentTimeStamp/1000))
  });
});


describe("Test disable transfer function", function() {
  it("disable transferFrom function", async function() {
    [FypToken, owner_1, owner_2, sig, sig_2] = await ready_mint('Dummy')
    // const owner_2_contract = await ethers.getContractFactory("FypToken", owner_2);
    const token = FypToken.connect(owner_2)

    const action = await FypToken.mint('Dummy', owner_1.address, sig.v, sig.r, sig.s, 
    owner_2.address, sig_2.v, sig_2.r, sig_2.s)
    const id = await event_listener(action,'return_uint256')

    try{ await token.transferFrom(owner_2.address, owner_1.address, id) }
    catch(err){ console.log(err) }
    
    const owner = await FypToken.ownerOf(id.toNumber())

    expect(owner).to.equal(owner_2.address)
  });
})