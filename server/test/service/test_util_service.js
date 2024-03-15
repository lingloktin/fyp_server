const fs = require('fs');
const sinon = require("sinon");
const { expect } = require("chai");
const {Util_Service} = require("../../service/util_service.js")

describe("Util_Service", function(){
    this.afterEach(function(){
        sinon.restore();
    })

    it("test mandatory_field_checking, one field is null, throw error with status 400", async function(){
        var error

        try{ Util_Service.mandatory_field_checking({email:1, dummy:null}) }
        catch(err) { error=err }

        //assertion
        expect(error.get_status()).to.equal(400);
    })

    it("test mandatory_field_checking, one field is null, throw error message", async function(){
        var error

        try{ Util_Service.mandatory_field_checking({email:1, dummy:null}) }
        catch(err) { error=err }

        //assertion
        expect(error.get_payload()).to.eql({message: "Missing Mandatory Field of , dummy"});
    })

    it("test mandatory_field_checking, one field is undefined, throw error message", async function(){
        var error

        try{ Util_Service.mandatory_field_checking({email:1, dummy:undefined}) }
        catch(err) { error=err }

        expect(error.get_payload()).to.eql({message: "Missing Mandatory Field of , dummy"});
    })

    it("test mandatory_field_checking, one field is empty string, throw error message", async function(){
        var error

        try{ Util_Service.mandatory_field_checking({email:1, dummy:""}) }
        catch(err) { error=err }

        expect(error.get_payload()).to.eql({message: "Missing Mandatory Field of , dummy"});
    })

    it("test mandatory_field_checking, multiple field is missing, throw error message", async function(){
        var error

        try{ Util_Service.mandatory_field_checking({email:1, dummy:"", random:null, happy:undefined}) }

        catch(err) { error=err }

        expect(error.get_payload()).to.eql({message: "Missing Mandatory Field of , dummy, random, happy"});
    })

    it("test mandatory_field_checking, no field is missing, no return value", async function(){
        const response = Util_Service.mandatory_field_checking({email:1, dummy:0, random:false, happy:{}, hi:[]})

        expect(response).to.equal(undefined);
    })
})