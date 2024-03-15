const { expect } = require("chai");
const sinon = require("sinon");
const { convertCompilerOptionsFromJson } = require("typescript");
const {Account_Bridge} = require("../../account/account_bridge.js")
const {Account} = require("../../model/account.js")
const {Account_Service} = require("../../service/account_service.js")
const {Util_Service} = require("../../service/util_service.js")

describe("Account_Bridge", function(){
    this.afterEach(function(){
        sinon.restore();
    })

    it("test create_account_bridge, delegate dict to mandatory field checking", async function(){
        const mock = sinon.fake.returns("dummy")
        const field_check_mock = sinon.fake()
        sinon.replace(Util_Service, "mandatory_field_checking", field_check_mock)
        sinon.replace(Account_Service, "account_creation", sinon.fake.returns(null))
        sinon.replace(Account, "model", {})
        sinon.replace(Account_Service, "verification", mock)

        const bridge = new Account_Bridge()
        const response = await bridge.create_account_bridge("email", "password", "name", "chain_address", "type", null, null)
        
        expect(field_check_mock.args[0][0]).to.eql({email:"email", password:"password", name:"name", chain_address:"chain_address", type:"type"});
    })

    it("test create_account_bridge, delegate email to account verification", async function(){
        const mock = sinon.fake.returns("dummy")
        const field_check_mock = sinon.fake()
        sinon.replace(Util_Service, "mandatory_field_checking", field_check_mock)
        sinon.replace(Account_Service, "account_creation", sinon.fake.returns(null))
        sinon.replace(Account, "model", {})
        sinon.replace(Account_Service, "verification", mock)

        const bridge = new Account_Bridge()
        const response = await bridge.create_account_bridge('dummy', null, null, null, null, null, null)

        expect(mock.args[0][0]).to.equal("dummy");
    })

    it("test create_account_bridge, delegate type to account verification", async function(){
        const mock = sinon.fake.returns("dummy")
        const field_check_mock = sinon.fake.returns(null)
        sinon.replace(Util_Service, "mandatory_field_checking", field_check_mock)
        sinon.replace(Account_Service, "account_creation", sinon.fake.returns(null))
        sinon.replace(Account, "model", {})
        sinon.replace(Account_Service, "verification", mock)

        const bridge = new Account_Bridge()
        const response = await bridge.create_account_bridge(null, null, null, null, "dummy", null, null)

        expect(mock.args[0][1]).to.equal("dummy");
    })

    it("test create_account_bridge, delegate id to account verification", async function(){
        const mock = sinon.fake.returns("dummy")
        const field_check_mock = sinon.fake.returns(null)
        sinon.replace(Util_Service, "mandatory_field_checking", field_check_mock)
        sinon.replace(Account_Service, "account_creation", sinon.fake.returns(null))
        sinon.replace(Account, "model", {})
        sinon.replace(Account_Service, "verification", mock)

        const bridge = new Account_Bridge()
        const response = await bridge.create_account_bridge(null, null, null, null, null, "dummy", null)

        expect(mock.args[0][2]).to.equal("dummy");
    })

    it("test create_account_bridge, delegate email to account_creation", async function(){
        sinon.replace(Account, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        const mock_validation = sinon.fake.returns(null)
        const mock_creation = sinon.fake.returns(null)
        sinon.replace(Account_Service, "verification", mock_validation)
        sinon.replace(Account_Service, "account_creation", mock_creation)

        const bridge = new Account_Bridge()
        const response = await bridge.create_account_bridge("dummy", null, null, null, null, null, null)

        expect(mock_creation.args[0][0]).to.equal("dummy");
    })

    it("test create_account_bridge, delegate password to account_creation", async function(){
        sinon.replace(Account, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        const mock_validation = sinon.fake.returns(null)
        const mock_creation = sinon.fake.returns(null)
        sinon.replace(Account_Service, "verification", mock_validation)
        sinon.replace(Account_Service, "account_creation", mock_creation)

        const bridge = new Account_Bridge()
        const response = await bridge.create_account_bridge(null, "dummy", null, null, null, null, null)

        expect(mock_creation.args[0][1]).to.equal("dummy");
    })

    it("test create_account_bridge, delegate name to account_creation", async function(){
        sinon.replace(Account, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        const mock_validation = sinon.fake.returns(null)
        const mock_creation = sinon.fake.returns(null)
        sinon.replace(Account_Service, "verification", mock_validation)
        sinon.replace(Account_Service, "account_creation", mock_creation)

        const bridge = new Account_Bridge()
        const response = await bridge.create_account_bridge(null, null, "dummy", null, null, null, null)

        expect(mock_creation.args[0][2]).to.equal("dummy");
    })

    it("test create_account_bridge, delegate chain_address to account_creation", async function(){
        sinon.replace(Account, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        const mock_validation = sinon.fake.returns(null)
        const mock_creation = sinon.fake.returns(null)
        sinon.replace(Account_Service, "verification", mock_validation)
        sinon.replace(Account_Service, "account_creation", mock_creation)

        const bridge = new Account_Bridge()
        const response = await bridge.create_account_bridge(null, null, null, "dummy", null, null, null)

        expect(mock_creation.args[0][3]).to.equal("dummy");
    })

    it("test create_account_bridge, delegate type to account_creation", async function(){
        sinon.replace(Account, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        const mock_validation = sinon.fake.returns(null)
        const mock_creation = sinon.fake.returns(null)
        sinon.replace(Account_Service, "verification", mock_validation)
        sinon.replace(Account_Service, "account_creation", mock_creation)

        const bridge = new Account_Bridge()
        const response = await bridge.create_account_bridge(null, null, null, null, "dummy", null, null)

        expect(mock_creation.args[0][4]).to.equal("dummy");
    })

    it("test create_account_bridge, delegate id to account_creation", async function(){
        sinon.replace(Account, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        const mock_validation = sinon.fake.returns(null)
        const mock_creation = sinon.fake.returns(null)
        sinon.replace(Account_Service, "verification", mock_validation)
        sinon.replace(Account_Service, "account_creation", mock_creation)

        const bridge = new Account_Bridge()
        const response = await bridge.create_account_bridge(null, null, null, null, null, "dummy", null)

        expect(mock_creation.args[0][5]).to.equal("dummy");
    })

    it("test create_account_bridge, return return value of account creation", async function(){
        sinon.replace(Account, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        const mock_validation = sinon.fake.returns(null)
        const mock_creation = sinon.fake.returns("dummy")
        sinon.replace(Account_Service, "verification", mock_validation)
        sinon.replace(Account_Service, "account_creation", mock_creation)

        const bridge = new Account_Bridge()
        const response = await bridge.create_account_bridge(null, null, null, null, "dummy", null, null)

        expect(response).to.equal('dummy');
    })

    it("test login_bridge, delegate dict to mandatory field checking", async function(){
        sinon.replace(Account, "model", {})
        const field_check_mock = sinon.fake()
        sinon.replace(Util_Service, "mandatory_field_checking", field_check_mock)
        const mock = sinon.fake.returns(null)
        sinon.replace(Account_Service, "account_authentication", mock)
        
        const bridge = new Account_Bridge()
        await bridge.login_bridge('email', "password", null)
       
        expect(field_check_mock.args[0][0]).to.eql({email:"email", password:"password"});
    })

    it("test login_bridge, delegate email to account_authentication function", async function(){
        sinon.replace(Account, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        const mock = sinon.fake.returns(null)
        sinon.replace(Account_Service, "account_authentication", mock)
        
        const bridge = new Account_Bridge()
        await bridge.login_bridge('dummy', null, null)

        expect(mock.args[0][0]).to.equal("dummy");
    })

    it("test login_bridge, delegate password to account_authentication function", async function(){
        sinon.replace(Account, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        const mock = sinon.fake.returns(null)
        sinon.replace(Account_Service, "account_authentication", mock)
        
        const bridge = new Account_Bridge()
        await bridge.login_bridge( null, 'dummy', null)

        expect(mock.args[0][1]).to.equal("dummy");
    })

    it("test login_bridge, return value of account_authentication", async function(){
        sinon.replace(Account, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        const mock = sinon.fake.returns("random value")
        sinon.replace(Account_Service, "account_authentication", mock)
        
        const bridge = new Account_Bridge()
        const response = await bridge.login_bridge( null, 'dummy', null)

        expect(response).to.equal("random value");
    })

})