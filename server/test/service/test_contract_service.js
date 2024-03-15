const sinon = require("sinon");
const { expect } = require("chai");
const muhammara = require("muhammara")
const ipfsClient = require("ipfs-http-client")
const { ethers } = require("ethers");
const {Contract_Service} = require("../../service/contract_service.js");
const {ipfs} = require("../../config.js")

describe("Contract_Service", function(){
    this.afterEach(function(){
        sinon.restore();
    })

    it("test encryption, delegate password to muhammara", async function(){
        const mock = sinon.fake()
        sinon.replace(muhammara, "recrypt", mock)

        Contract_Service.encryption("sdfdsf", "dummy")

        expect(mock.args[0][2]).to.eql({userPassword: "dummy", ownerPassword: "dummy"});
    })

    it("test encryption, error occur throw new error", async function(){
        var error
        const mock = sinon.fake.throws(new Error("gg"))
        sinon.replace(muhammara, "recrypt", mock)

        try{ Contract_Service.encryption("sdfd", "dummy") }
        catch(err) { error=err }

        expect(error.message).to.equal("encryption error");
    })

    it("test get_contract, empty payload, throw response with status 404", async function(){
        var error

        try{ (await Contract_Service.get_contract(null, null, {findOne: sinon.fake.returns(null)})) }
        catch(err) { error=err }

        expect(error.get_status()).to.equal(404);
    })

    it("test get_contract, empty payload, throw response with error message", async function(){
        var error

        try{ await Contract_Service.get_contract(null, null, {findOne: sinon.fake.returns(null)}) }
        catch(err) { error=err }

        expect(error.get_payload()).to.eql({message:"Invalid id"});
    })

    it("test get_contract, payload with company email not match, throw response with status 404", async function(){
        var error

        try{ await Contract_Service.get_contract(null, "null", {findOne: sinon.fake.returns({company_email: "dummy", candidate_email:"random"})}) }
        catch(err) { error=err }

        expect(error.get_status()).to.equal(400);
    })

    it("test get_contract, payload with company email not match, throw response with error message", async function(){
        var error

        try{ await Contract_Service.get_contract(null, "null", {findOne: sinon.fake.returns({company_email: "dummy", candidate_email:"random"})}) }
        catch(err) { error=err }

        expect(error.get_payload()).to.eql({message:"No access right to the document"});
    })

    it("test get_contract, payload email match candidate_email, return contract", async function(){
        const response = await Contract_Service.get_contract(null, "dummy", {findOne: sinon.fake.returns({candidate_email: "dummy", contract:"random"})}) 

        expect(response).to.equal("random");
    })

    it("test get_contract, payload email match company_email, return contract", async function(){
        const response = await Contract_Service.get_contract(null, "dummy", {findOne: sinon.fake.returns({company_email: "dummy", contract:"random"})}) 

        expect(response).to.equal("random");
    })

    it("test get_record, empty payload, throw response with status 404", async function(){
        var error

        try{ (await Contract_Service.get_record(null, null, {findOne: sinon.fake.returns(null)})) }
        catch(err) { error=err }

        expect(error.get_status()).to.equal(404);
    })

    it("test get_record, empty payload, throw response with error message", async function(){
        var error

        try{ await Contract_Service.get_record(null, null, {findOne: sinon.fake.returns(null)}) }
        catch(err) { error=err }

        expect(error.get_payload()).to.eql({message:"Invalid id"});
    })

    it("test get_record, payload with company email not match, throw response with status 404", async function(){
        var error

        try{ await Contract_Service.get_record(null, "null", {findOne: sinon.fake.returns({company_email: "dummy", candidate_email:"random"})}) }
        catch(err) { error=err }

        expect(error.get_status()).to.equal(400);
    })

    it("test get_record, payload with company email not match, throw response with error message", async function(){
        var error

        try{ await Contract_Service.get_record(null, "null", {findOne: sinon.fake.returns({company_email: "dummy", candidate_email:"random"})}) }
        catch(err) { error=err }

        expect(error.get_payload()).to.eql({message:"No access right"});
    })

    it("test get_record, payload email match candidate_email, return status", async function(){
        const response = await Contract_Service.get_record(null, "dummy", {findOne: sinon.fake.returns({candidate_email: "dummy", status:"random"})}) 

        expect(response).to.eql({candidate_email: "dummy", status:"random"});
    })

    it("test get_record, payload email match company_email, return status", async function(){
        const response = await Contract_Service.get_record(null, "dummy", {findOne: sinon.fake.returns({company_email: "dummy", status:"random"})}) 

        expect(response).to.eql({company_email: "dummy", status:"random"});
    })

    it("test add_ipfs, delegate header to create", async function(){
        const mock = sinon.fake.returns({add: sinon.fake.returns({})})
        sinon.replace(ipfsClient, "create", mock)

        const response = await Contract_Service.add_ipfs(null, {})

        expect(mock.args[0][0]).to.eql({
            host: 'ipfs.infura.io',
            port: 5001,
            protocol: 'https',
            apiPath: '/api/v0',
            headers: {
                authorization: 'Basic ' + Buffer.from(ipfs.projectID + ':' + ipfs.secret).toString('base64'),
            }
        });
    })

    it("test add_ipfs, delegate file_buffer to add", async function(){
        const mock = sinon.fake.returns({})
        sinon.replace(ipfsClient, "create", sinon.fake.returns({add: mock}))

        const response = await Contract_Service.add_ipfs("dummu", {})

        expect(mock.args[0][0]).to.equal("dummu");
    })

    it("test add_ipfs, delegate json data to add", async function(){
        const mock = sinon.fake.returns({path: "dummy"})
        sinon.replace(ipfsClient, "create", sinon.fake.returns({add: mock}))

        const response = await Contract_Service.add_ipfs(null, {sdfs:"sdfsdfs"})

        expect(mock.args[1][0]).to.equal(JSON.stringify({
            sdfs:"sdfsdfs",
            contract: "https://fyp22041.infura-ipfs.io/ipfs/dummy"
        }));
    })
    
    it("test add_ipfs, return response.path", async function(){
        const mock = sinon.fake.returns({path: "sdfsdf"})
        sinon.replace(ipfsClient, "create", sinon.fake.returns({add: mock}))

        const response = await Contract_Service.add_ipfs(null, {})

        expect(response).to.equal("sdfsdf");
    })
    
    it("test verify_sig, signature not match address, return false", async function(){
        const owner = ethers.Wallet.createRandom()
        const random_user = ethers.Wallet.createRandom()
        const signature = await owner.signMessage('random message')

        const response = Contract_Service.verify_sig(random_user.address, 'random message', signature)

        expect(response).to.equal(false);
    })
    
    it("test verify_sig, signature not match message, return false", async function(){
        const owner = ethers.Wallet.createRandom()
        const signature = await owner.signMessage('message')

        const response = Contract_Service.verify_sig(owner.address, 'random message', signature)

        expect(response).to.equal(false);
    })
    
    it("test verify_sig, signature match message, return true", async function(){
        const owner = ethers.Wallet.createRandom()
        const signature = await owner.signMessage('message')

        const response = Contract_Service.verify_sig(owner.address, 'message', signature)

        expect(response).to.equal(true);
    })
})
  