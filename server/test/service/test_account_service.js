const {Account_Service} = require("../../service/account_service.js")
const sinon = require("sinon");
const { expect } = require("chai");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const {secret} = require("../../config.js")

describe("Account_Service", function(){
    this.afterEach(function(){
        sinon.restore();
    })

    it("test verification, invalid pattern of email, throw response with status 404", async function(){
        var error
        try{ await Account_Service.verification("sdffsd", null, null, null) }
        catch(err){ error = err }
        //assertion
        expect(error.get_status()).to.equal(404);
    })

    it("test verification, invalid pattern of email, throw response with error message", async function(){
        var error
        try{ await Account_Service.verification("sdffsd", null, null, null) }
        catch(err){ error = err }
        //assertion
        expect(error.get_payload()).to.eql({message: "Invalid pattern of email"});
    })

    it("test verification, correct pattern email, email used, throw response with status 404", async function(){
        var error
        const mock = sinon.fake.returns({id:"sdfsdfesfew"})

        try{ await Account_Service.verification("sldjfsl23423j@gmail.com", null, null, {findOne: mock}) }
        catch(err){ error = err }

        //assertion
        expect(error.get_status()).to.equal(404);
    })

    it("test verification, correct pattern email, email used, throw response with error message", async function(){
        var error
        const mock = sinon.fake.returns({id:"sdfsdfesfew"})

        try{ await Account_Service.verification("sldjfsl23423j@gmail.com", null, null, {findOne: mock}) }
        catch(err){ error = err }

        //assertion
        expect(error.get_payload()).to.eql({message: "Account with same email exist"});
    })
    
    it("test verification, incorrect type, throw response with status 404", async function(){
        var error
        const mock = sinon.fake.returns(null)

        try{ await Account_Service.verification("sldjfsl23423j@gmail.com", 'Individual', null, {findOne: mock}) }
        catch(err){ error = err }

        //assertion
        expect(error.get_status()).to.equal(404);
    })
    
    it("test verification, incorrect type, throw response with error message", async function(){
        var error
        const mock = sinon.fake.returns(null)

        try{ await Account_Service.verification("sldjfsl23423j@gmail.com", 'Individual', null, {findOne: mock}) }
        catch(err){ error = err }

        //assertion
        expect(error.get_payload()).to.eql({message: "Incorrect Account Type"});
    })
    
    it("test verification, id==null for individual account, throw response with status 404", async function(){
        var error
        const mock = sinon.fake.returns(null)

        try{ await Account_Service.verification("sldjfsl23423j@gmail.com", 'INDIVIDUAL', null, {findOne: mock}) }
        catch(err){ error = err }

        //assertion
        expect(error.get_status()).to.equal(404);
    })
    
    it("test verification, id==null for individual account, throw response with error message", async function(){
        var error
        const mock = sinon.fake.returns(null)

        try{ await Account_Service.verification("sldjfsl23423j@gmail.com", 'INDIVIDUAL', null, {findOne: mock}) }
        catch(err){ error = err }

        //assertion
        expect(error.get_payload()).to.eql({message: "Missing id number"});
    })
    
    it("test verification, id==undefined for individual account, throw response with status 404", async function(){
        var error
        const mock = sinon.fake.returns(null)

        try{ await Account_Service.verification("sldjfsl23423j@gmail.com", 'INDIVIDUAL', undefined, {findOne: mock}) }
        catch(err){ error = err }

        //assertion
        expect(error.get_status()).to.equal(404);
    })
    it("test verification, id==undefined for individual account, throw response with error message", async function(){
        var error
        const mock = sinon.fake.returns(null)

        try{ await Account_Service.verification("sldjfsl23423j@gmail.com", 'INDIVIDUAL', undefined, {findOne: mock}) }
        catch(err){ error = err }

        //assertion
        expect(error.get_payload()).to.eql({message: "Missing id number"});
    })
    
    it("test verification, all correct for individual account, return undefined", async function(){
        const mock = sinon.fake.returns(null)

        const response = await Account_Service.verification("sldjfsl23423j@gmail.com", 'INDIVIDUAL', "dsfsd", {findOne: mock})

        //assertion
        expect(response).to.equal(undefined);
    })

    it("test verification, all correct for business account, return undefined", async function(){
        const mock = sinon.fake.returns(null)

        const response = await Account_Service.verification("sldjfsl23423j@gmail.com", 'BUSINESS', null, {findOne: mock})

        //assertion
        expect(response).to.equal(undefined);
    })

    it("test account_creation, delegate password to hash", async function(){
        const mock = sinon.fake()
        sinon.replace(bcrypt, "hash", mock)
        const create_mock = sinon.fake.returns({dataValues: {password: "sdfsdfs"}})

        const response = await Account_Service.account_creation(null, 'dummy', null, null, null, null, {create: create_mock})

        //assertion
        expect(mock.args[0][0]).to.equal('dummy');
    })

    it("test account_creation, delegate salt to hash", async function(){
        const mock = sinon.fake()
        sinon.replace(bcrypt, "hash", mock)
        const create_mock = sinon.fake.returns({dataValues: {password: "sdfsdfs"}})

        const response = await Account_Service.account_creation(null, null, null, null, null, null, {create: create_mock})

        //assertion
        expect(mock.args[0][1]).to.equal(10);
    })

    it("test account_creation, error occurs, throw response with status code 404", async function(){
        var error

        try{ await Account_Service.account_creation(null, null, null, null, null, null, null) }
        catch (err) { error = err}

        //assertion
        expect(error.get_status()).to.equal(404);
    })

    it("test account_creation, error occurs, throw response with err message", async function(){
        var error

        try{ await Account_Service.account_creation(null, null, null, null, null, null, null) }
        catch (err) { error = err}

        //assertion
        expect(error.get_payload()).to.eql({message: "Error occured, please try again"});
    })

    it("test account_creation, id is undefined, assign null to id_hash", async function(){
        const mock = sinon.fake.returns({dataValues: {password: "sdfsdfs"}})
        const hash_mock = sinon.fake.returns('null')
        sinon.replace(bcrypt, "hash", hash_mock)

        await Account_Service.account_creation(null, null, null, null, null, undefined, {create: mock})
        //assertion
        expect(mock.args[0][5]).to.equal(null);
    })

    it("test account_creation, id is null, assign null to id_hash", async function(){
        const mock = sinon.fake.returns({dataValues: {password: "sdfsdfs"}})
        const hash_mock = sinon.fake.returns(null)
        sinon.replace(bcrypt, "hash", hash_mock)
        
        await Account_Service.account_creation(null, null, null, null, null, null, {create: mock})
        //assertion
        expect(mock.args[0][5]).to.equal(null);
    })

    it("test account_creation, id is null, delegate id to hash", async function(){
        const mock = sinon.fake.returns({dataValues: {password: "sdfsdfs"}})
        const hash_mock = sinon.fake.returns(null)
        sinon.replace(bcrypt, "hash", hash_mock)

        await Account_Service.account_creation(null, null, null, null, null, "dummy", {create: mock})
        //assertion
        expect(hash_mock.secondCall.args[0]).to.equal("dummy");
    })

    it("test account_creation, id is null, delegate salt to hash", async function(){
        const mock = sinon.fake.returns({dataValues: {password: "sdfsdfs"}})
        const hash_mock = sinon.fake.returns(null)
        sinon.replace(bcrypt, "hash", hash_mock)

        await Account_Service.account_creation(null, null, null, null, null, "dummy", {create: mock})
        //assertion
        expect(hash_mock.args[0][1]).to.equal(10);
    })

    it("test account_creation, id is null, assign hash value to id_hash", async function(){
        const mock = sinon.fake.returns({dataValues: {password: "sdfsdfs"}})
        const hash_mock = sinon.fake.returns("dummy")
        sinon.replace(bcrypt, "hash", hash_mock)

        await Account_Service.account_creation(null, null, null, null, null, "random value", {create: mock})
        //assertion
        expect(mock.args[0][5]).to.equal("dummy");
    })

    it("test account_creation, delegate email to create", async function(){
        const mock = sinon.fake.returns({dataValues: {password: "sdfsdfs"}})
        
        await Account_Service.account_creation("dummy", "null", null, null, null, null, {create: mock})
        //assertion
        expect(mock.args[0][0]).to.equal("dummy");
    })
    
    it("test account_creation, delegate hash to create", async function(){
        const mock = sinon.fake.returns({dataValues: {password: "sdfsdfs"}})
        
        await Account_Service.account_creation(null, "password", null, null, null, null, {create: mock})
        const hash = await bcrypt.compare("password", mock.args[0][1])
        
        //assertion
        expect(hash).to.equal(true);
    })
    
    it("test account_creation, delegate name to create", async function(){
        const mock = sinon.fake.returns({dataValues: {password: "sdfsdfs"}})
        
        await Account_Service.account_creation(null, "null", "dummy", null, null, null, {create: mock})
        
        //assertion
        expect(mock.args[0][2]).to.equal("dummy");
    })
        
    it("test account_creation, delegate chain_address to create", async function(){
        const mock = sinon.fake.returns({dataValues: {password: "sdfsdfs"}})
        
        await Account_Service.account_creation(null, "null", null, "dummy", null, null, {create: mock})
        
        //assertion
        expect(mock.args[0][3]).to.equal("dummy");
    })
            
    it("test account_creation, delegate type to create", async function(){
        const mock = sinon.fake.returns({dataValues: {password: "sdfsdfs"}})
        
        await Account_Service.account_creation(null, "null", null, null, "dummy",null ,{create: mock})
        
        //assertion
        expect(mock.args[0][4]).to.equal("dummy");
    })
            
    it("test account_creation, delegate id_hash to create", async function(){
        const mock = sinon.fake.returns({dataValues: {password: "sdfsdfs"}})
        
        await Account_Service.account_creation(null, "null", null, null, "dummy", null, {create: mock})
        
        //assertion
        expect(mock.args[0][4]).to.equal("dummy");
    })

    it("test account_creation, successfully create record, delegate data to sign", async function(){
        const mock = sinon.fake.returns({dataValues: {           
            email: 'email',
            id: 'id', 
            type: 'type',
            name: 'name',
            chain_address: 'chain_address'
        }})
        const jwt_mock = sinon.fake.returns(null)
        sinon.replace(jwt, "sign", jwt_mock)

        const response = await Account_Service.account_creation(null, "null", null, null, "dummy", null, {create: mock})
        
        //assertion
        expect(jwt_mock.args[0][0]).to.eql({user: {
            email: 'email',
            id: 'id', 
            type: 'type',
            name: 'name',
            chain_address: 'chain_address'
        }});
    })
    
    it("test account_creation, successfully create record, delegate secret to sign", async function(){
        const mock = sinon.fake.returns({dataValues:{id: "random value", password: "sdfsdfs", email:"testing_email", type: "abc", name:"hi", chain_address: "sdfsfewr", createdAt: "sdfsdff"}})
        const jwt_mock = sinon.fake.returns(null)
        sinon.replace(jwt, "sign", jwt_mock)

        const response = await Account_Service.account_creation(null, "null", null, null, "dummy", null, {create: mock})
        
        //assertion
        expect(jwt_mock.args[0][1]).to.equal(secret);
    })
        
    it("test account_creation, successfully create record, delegate options to sign", async function(){
        const mock = sinon.fake.returns({dataValues:{id: "random value", password: "sdfsdfs", email:"testing_email", type: "abc", name:"hi", chain_address: "sdfsfewr", createdAt: "sdfsdff"}})
        const jwt_mock = sinon.fake.returns(null)
        sinon.replace(jwt, "sign", jwt_mock)

        const response = await Account_Service.account_creation(null, "null", null, null, "dummy", null, {create: mock})
        
        //assertion
        expect(jwt_mock.args[0][2]).to.eql({expiresIn: "8h"});
    })
        
    it("test account_creation, successfully create record, return response json", async function(){
        const mock = sinon.fake.returns({dataValues:{id: "random value", password: "sdfsdfs", email:"testing_email", type: "abc", name:"hi", chain_address: "sdfsfewr", createdAt: "sdfsdff"}})
        const jwt_mock = sinon.fake.returns("target token")
        sinon.replace(jwt, "sign", jwt_mock)

        const response = await Account_Service.account_creation(null, "null", null, null, "dummy", null, {create: mock})
        
        //assertion
        expect(response).to.eql({
            email: "testing_email",
            name: "hi",
            chain_address: "sdfsfewr",
            type: "abc",
            createdAt: "sdfsdff",
            accessToken: "target token"
        });
    })
    
    it("test account_creation, error occured, throw response with status 404", async function(){
        var error
        const mock = sinon.fake.returns(null)
        
        try { await Account_Service.account_creation(null, "null", null, null, "dummy", null, {create: mock}) }
        catch(err) { error = err}
        
        //assertion
        expect(error.get_status()).to.equal(404);
    })
    
    it("test account_creation, error occured, throw response with error messgae", async function(){
        var error
        const mock = sinon.fake.returns(null)
        
        try { await Account_Service.account_creation(null, "null", null, null, "dummy", null, {create: mock}) }
        catch(err) { error = err}
        
        //assertion
        expect(error.get_payload()).to.eql({message: "Error occured, please try again"});
    })
    
    it("test account_authentication, email does not exist, throw response with status 404", async function(){
        var error
        const mock = sinon.fake.returns(null)

        try{ await Account_Service.account_authentication(null, null, {findOne: mock}) }
        catch (err){ error = err}

        //assertion
        expect(error.get_status()).to.equal(404);
    })
    
    it("test account_authentication, email does not exist, throw response with error message", async function(){
        var error
        const mock = sinon.fake.returns(null)

        try{ await Account_Service.account_authentication(null, null, {findOne: mock}) }
        catch(err){ error = err}

        //assertion
        expect(error.get_payload()).to.eql({message: "Account does not exist"});
    })
    
    it("test account_authentication, email exist, incorrect password, throw response with status 404", async function(){
        var error
        const mock = sinon.fake.returns("random value")
        const compare_mock = sinon.fake.returns(false)
        sinon.replace(bcrypt, "compare", compare_mock)

        try{ await Account_Service.account_authentication(null, null, {findOne: mock}) }
        catch(err){ error=err }

        //assertion
        expect(error.get_status()).to.equal(401);
    })
    
    it("test account_authentication, email exist, incorrect password, throw response with error message", async function(){
        var error
        const mock = sinon.fake.returns("random value")
        const compare_mock = sinon.fake.returns(false)
        sinon.replace(bcrypt, "compare", compare_mock)

        try{ await Account_Service.account_authentication(null, null, {findOne: mock}) }
        catch(err){ error=err }

        //assertion
        expect(error.get_payload()).to.eql({message: "Incorrect password"});
    })
    
    it("test account_authentication, authenticated, delegate data to sign", async function(){
        const mock = sinon.fake.returns({dataValues: {           
            email: 'email',
            id: 'id', 
            type: 'type',
            name: 'name',
            chain_address: 'chain_address'
        }})
        const compare_mock = sinon.fake.returns(true)
        sinon.replace(bcrypt, "compare", compare_mock)
        const jwt_mock = sinon.fake.returns(null)
        sinon.replace(jwt, "sign", jwt_mock)

        const response = await Account_Service.account_authentication(null, null, {findOne: mock})

        //assertion
        expect(jwt_mock.args[0][0]).to.eql({user: {
            email: 'email',
            id: 'id', 
            type: 'type',
            name: 'name',
            chain_address: 'chain_address'
        }});
    })
    
    it("test account_authentication, email exist, correct password, delegate secret to sign", async function(){
        const mock = sinon.fake.returns({dataValues: {updatedAt: "sdfsdfs"}})
        const compare_mock = sinon.fake.returns(true)
        sinon.replace(bcrypt, "compare", compare_mock)
        const jwt_mock = sinon.fake.returns(null)
        sinon.replace(jwt, "sign", jwt_mock)

        const response = await Account_Service.account_authentication(null, null, {findOne: mock})

        //assertion
        expect(jwt_mock.args[0][1]).to.eql(secret);
    })
    
    it("test account_authentication, email exist, correct password, delegate option to sign", async function(){
        const mock = sinon.fake.returns({dataValues: {updatedAt: "sdfsdfs"}})
        const compare_mock = sinon.fake.returns(true)
        sinon.replace(bcrypt, "compare", compare_mock)
        const jwt_mock = sinon.fake.returns(null)
        sinon.replace(jwt, "sign", jwt_mock)

        const response = await Account_Service.account_authentication(null, null, {findOne: mock})

        //assertion
        expect(jwt_mock.args[0][2]).to.eql({expiresIn: "8h"});
    })
    
    it("test account_authentication, email exist, correct password, return expected object", async function(){
        const mock = sinon.fake.returns({dataValues:{updatedAt:'sdfsd'}})
        const compare_mock = sinon.fake.returns(true)
        sinon.replace(bcrypt, "compare", compare_mock)
        const jwt_mock = sinon.fake.returns("dummy")
        sinon.replace(jwt, "sign", jwt_mock)

        const response = await Account_Service.account_authentication(null, null, {findOne: mock})

        //assertion
        expect(response).to.eql({chain_address:undefined, email:undefined, name:undefined, type:undefined,updatedAt:'sdfsd', accessToken:'dummy'});
    })
    
    it("test token_authentication, undefined token, throw error with status 403", async function(){
        var error 

        try{ await Account_Service.token_authentication(undefined) }
        catch(err){ error = err}

        //assertion
        expect(error.get_status()).to.equal(403);
    })
    
    it("test token_authentication, undefined token, throw error with error message", async function(){
        var error 

        try{ await Account_Service.token_authentication(undefined) }
        catch(err){ error = err}

        //assertion
        expect(error.get_payload()).to.eql({message: "Please login, and provide token to the header"});
    })
    
    it("test token_authentication, null token, throw error with status 403", async function(){
        var error 

        try{ await Account_Service.token_authentication(null) }
        catch(err){ error = err}

        //assertion
        expect(error.get_status()).to.equal(403);
    })
    
    it("test token_authentication, null token, throw error with error message", async function(){
        var error 

        try{ await Account_Service.token_authentication(null) }
        catch(err){ error = err}

        //assertion
        expect(error.get_payload()).to.eql({message: "Please login, and provide token to the header"});
    })
    
    it("test token_authentication, token existed, delegate token to verify", async function(){
        const time_mock = sinon.fake.returns(1000)
        sinon.replace(Date, "now", time_mock)
        const jwt_mock = sinon.fake.returns({exp:0})
        sinon.replace(jwt, "verify", jwt_mock)

        try{ await Account_Service.token_authentication("token") }
        catch(err){}

        //assertion
        expect(jwt_mock.args[0][0]).to.equal("token");
    })
    
    it("test token_authentication, token existed, delegate secret to verify", async function(){
        const time_mock = sinon.fake.returns(1000)
        sinon.replace(Date, "now", time_mock)
        const jwt_mock = sinon.fake.returns({exp:0})
        sinon.replace(jwt, "verify", jwt_mock)

        try{ await Account_Service.token_authentication("token") }
        catch(err){}

        //assertion
        expect(jwt_mock.args[0][1]).to.equal(secret);
    })
    
    // it("test token_authentication, current time less than expired time, return decoded.user", async function(){
    //     var clock = sinon.useFakeTimers()
    //     const jwt_mock = sinon.fake.returns({exp:100000, user:"dummy value"})
    //     sinon.replace(jwt, "verify", jwt_mock)

    //     const response = await Account_Service.token_authentication(secret)

    //     //assertion
    //     expect(response).to.equal("dummy value");
    //     clock.restore()
    // })
    
    it("test token_authentication, error occured from jwt.verify, throw response with 401 status", async function(){
        var error
        const jwt_mock = sinon.fake.throws(new Error("not apple pie"));
        sinon.replace(jwt, "verify", jwt_mock)

        try{ await Account_Service.token_authentication(secret) }
        catch(err){ error=err }

        //assertion
        expect(error.get_status()).to.equal(401);
    })
    
    it("test token_authentication, error occured from jwt.verify, throw response with error code", async function(){
        var error
        const jwt_mock = sinon.fake.throws(new Error("not apple pie"));
        sinon.replace(jwt, "verify", jwt_mock)

        try{ await Account_Service.token_authentication(secret) }
        catch(err){ error=err }

        //assertion
        expect(error.get_payload()).to.eql({message: "Unauthorized"});
    })
    
    it("test business_account_only, type match, throw response with 401 status", async function(){
        var error

        try{ await Account_Service.business_account_only("INDIVIDUAL") }
        catch(err){ error=err }

        //assertion
        expect(error.get_status()).to.equal(401);
    })
    
    it("test business_account_only, type match, throw response with 401 status", async function(){
        var error

        try{ await Account_Service.business_account_only("INDIVIDUAL") }
        catch(err){ error=err }

        //assertion
        expect(error.get_payload()).to.eql({message: "Unauthorized"});
    })
    
    it("test individual_account_only, type match, throw response with 401 status", async function(){
        var error

        try{ await Account_Service.individual_account_only("BUSINESS") }
        catch(err){ error=err }

        //assertion
        expect(error.get_status()).to.equal(401);
    })
    
    it("test individual_account_only, type match, throw response with 401 status", async function(){
        var error

        try{ await Account_Service.individual_account_only("BUSINESS") }
        catch(err){ error=err }

        //assertion
        expect(error.get_payload()).to.eql({message: "Unauthorized"});
    })
})