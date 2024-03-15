const sinon = require("sinon");
const { expect } = require("chai");
const ethers = require("ethers")
const {Util_Service} = require("../../service/util_service.js")
const {Account} = require("../../model/account.js")
const {Agreement} = require("../../model/agreement.js")
const {Offer_Bridge} = require("../../offer/offer_bridge.js")
const {Contract_Service} = require("../../service/contract_service.js")
const {Email_Service} = require("../../service/email_service.js")
const {Handler} = require("../../util/handler.js")
const {NFT_Service} = require("../../service/NFT_service.js")
const {currentTimeStamp} = require("../../config.js");

const agreement_obj = (id=null, job_title=null, company_email=null, candidate_email=null, status='COMPLETED', updatedAt=null, job_description=null, createdAt=null, candidate_sig=null, company_sig=null, cid=null) =>{
    return {
        id: id,
        cid: cid,
        job_title: job_title, 
        job_description: job_description,
        company_email: company_email, 
        candidate_email: candidate_email, 
        status: status, 
        updatedAt: updatedAt,
        createdAt: createdAt,
        candidate_sig: candidate_sig,
        company_sig: company_sig
    }
}

describe("Offer_Bridge", function(){
    this.beforeEach(function(){
        sinon.replace(console, "log", sinon.fake())
    })
    this.afterEach(function(){
        sinon.restore();
    })

    it("test post_bridge, delegate dict to mandatory field checking", async function(){
        //test setup
        const field_check_mock = sinon.fake()
        sinon.replace(Util_Service, "mandatory_field_checking", field_check_mock)
        sinon.replace(Account, "model", {})
        sinon.replace(Agreement, "model", {})
        sinon.replace(Contract_Service, "encryption", sinon.fake())
        sinon.replace(Account.prototype, "findOne", sinon.fake.returns({name:null}))
        sinon.replace(Agreement.prototype, "create", sinon.fake.returns({id:null}))
        sinon.replace(Email_Service.prototype, "send_offer", sinon.fake())    

        //target
        const response = await Offer_Bridge.post_bridge('job_title', 'candidate_email', 'company_email', null, 
            null, 'contract_file', 'password', null, null)
        
        //asertion
        expect(field_check_mock.args[0][0]).to.eql({
            job_title: 'job_title', 
            candidate_email: 'candidate_email',
            contract: 'contract_file', 
            password: 'password'
        });
    })

    it("test post_bridge, delegate contract_file to encryption", async function(){
        const encryption_mock = sinon.fake()
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Account, "model", {})
        sinon.replace(Agreement, "model", {})
        sinon.replace(Contract_Service, "encryption", encryption_mock)
        sinon.replace(Account.prototype, "findOne", sinon.fake.returns({name:null}))
        sinon.replace(Agreement.prototype, "create", sinon.fake.returns({id:null}))
        sinon.replace(Email_Service.prototype, "send_offer", sinon.fake())    

        const response = await Offer_Bridge.post_bridge(null, null, null, null, 
            null, 'dummyy', null, null, null)
        
        expect(encryption_mock.args[0][0]).to.equal("dummyy")
    })

    it("test post_bridge, delegate password to encryption", async function(){
        const encryption_mock = sinon.fake()
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Account, "model", {})
        sinon.replace(Agreement, "model", {})
        sinon.replace(Contract_Service, "encryption", encryption_mock)
        sinon.replace(Account.prototype, "findOne", sinon.fake.returns({name:null}))
        sinon.replace(Agreement.prototype, "create", sinon.fake.returns({id:null}))
        sinon.replace(Email_Service.prototype, "send_offer", sinon.fake())    

        const response = await Offer_Bridge.post_bridge(null, null, null, null, 
            null, null, 'dummyy', null, null)
        
        expect(encryption_mock.args[0][1]).to.equal("dummyy")
    })

    it("test post_bridge, delegate job_title to agreement_db.create", async function(){
        const create_mock = sinon.fake.returns({id:null})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Account, "model", {})
        sinon.replace(Agreement, "model", {})
        sinon.replace(Contract_Service, "encryption", sinon.fake())
        sinon.replace(Account.prototype, "findOne", sinon.fake.returns({name:null}))
        sinon.replace(Agreement.prototype, "create", create_mock)
        sinon.replace(Email_Service.prototype, "send_offer", sinon.fake())    

        const response = await Offer_Bridge.post_bridge("dummy", null, null, null, 
            null, null, null, null, null)
        
        expect(create_mock.args[0][0]).to.equal("dummy")
    })

    it("test post_bridge, delegate candidate_email to agreement_db.create", async function(){
        const create_mock = sinon.fake.returns({id:null})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Account, "model", {})
        sinon.replace(Agreement, "model", {})
        sinon.replace(Contract_Service, "encryption", sinon.fake())
        sinon.replace(Account.prototype, "findOne", sinon.fake.returns({name:null}))
        sinon.replace(Agreement.prototype, "create", create_mock)
        sinon.replace(Email_Service.prototype, "send_offer", sinon.fake())    

        const response = await Offer_Bridge.post_bridge(null, "dummy", null, null, 
            null, null, null, null, null)
        
        expect(create_mock.args[0][1]).to.equal("dummy")
    })

    it("test post_bridge, delegate company_email to agreement_db.create", async function(){
        const create_mock = sinon.fake.returns({id:null})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Account, "model", {})
        sinon.replace(Agreement, "model", {})
        sinon.replace(Contract_Service, "encryption", sinon.fake())
        sinon.replace(Account.prototype, "findOne", sinon.fake.returns({name:null}))
        sinon.replace(Agreement.prototype, "create", create_mock)
        sinon.replace(Email_Service.prototype, "send_offer", sinon.fake())    

        const response = await Offer_Bridge.post_bridge(null, null, "dummy", null, 
            null, null, null, null, null)
        
        expect(create_mock.args[0][2]).to.equal("dummy")
    })

    it("test post_bridge, delegate company_email to agreement_db.create", async function(){
        const create_mock = sinon.fake.returns({id:null})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Account, "model", {})
        sinon.replace(Agreement, "model", {})
        sinon.replace(Contract_Service, "encryption", sinon.fake.returns("dummy"))
        sinon.replace(Account.prototype, "findOne", sinon.fake.returns({name:null}))
        sinon.replace(Agreement.prototype, "create", create_mock)
        sinon.replace(Email_Service.prototype, "send_offer", sinon.fake())    

        const response = await Offer_Bridge.post_bridge(null, null, null, null, 
            null, null, null, null, null)
        
        expect(create_mock.args[0][3]).to.equal("dummy")
    })

    it("test post_bridge, delegate REQ_REVIEW to agreement_db.create", async function(){
        const create_mock = sinon.fake.returns({id:null})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Account, "model", {})
        sinon.replace(Agreement, "model", {})
        sinon.replace(Contract_Service, "encryption", sinon.fake())
        sinon.replace(Account.prototype, "findOne", sinon.fake.returns({name:null}))
        sinon.replace(Agreement.prototype, "create", create_mock)
        sinon.replace(Email_Service.prototype, "send_offer", sinon.fake())    

        const response = await Offer_Bridge.post_bridge(null, null, null, null, 
            null, null, null, null, null)
        
        expect(create_mock.args[0][4]).to.equal("REQ_REVIEW")
    })

    it("test post_bridge, delegate job_description to agreement_db.create", async function(){
        const create_mock = sinon.fake.returns({id:null})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Account, "model", {})
        sinon.replace(Agreement, "model", {})
        sinon.replace(Contract_Service, "encryption", sinon.fake())
        sinon.replace(Account.prototype, "findOne", sinon.fake.returns({name:null}))
        sinon.replace(Agreement.prototype, "create", create_mock)
        sinon.replace(Email_Service.prototype, "send_offer", sinon.fake())    

        const response = await Offer_Bridge.post_bridge(null, null, null, null, 
            null, null, null, "dummy", null)
        
        expect(create_mock.args[0][5]).to.equal("dummy")
    })

    it("test post_bridge, delegate query to account_db.findOne", async function(){
        const findOne_mock = sinon.fake.returns({name:null}) 
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Account, "model", {})
        sinon.replace(Agreement, "model", {})
        sinon.replace(Contract_Service, "encryption", sinon.fake())
        sinon.replace(Account.prototype, "findOne", findOne_mock)
        sinon.replace(Agreement.prototype, "create", sinon.fake.returns({id:null}))
        sinon.replace(Email_Service.prototype, "send_offer", sinon.fake())    

        const response = await Offer_Bridge.post_bridge(null, "dummy", null, null, 
            null, null, null, null, null)
        
        expect(findOne_mock.args[0][0]).to.eql({email: "dummy"})
    })

    it("test post_bridge, delegate candidate_email to send_offer", async function(){
        const send_offer_mock = sinon.fake()
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Account, "model", {})
        sinon.replace(Agreement, "model", {})
        sinon.replace(Contract_Service, "encryption", sinon.fake())
        sinon.replace(Account.prototype, "findOne", sinon.fake.returns({name:null}) )
        sinon.replace(Agreement.prototype, "create", sinon.fake.returns({id:null}))
        sinon.replace(Email_Service.prototype, "send_offer", send_offer_mock)    

        const response = await Offer_Bridge.post_bridge(null, "dummy", null, null, 
            null, null, null, null, null)
        
        expect(send_offer_mock.args[0][0]).to.equal("dummy")
    })

    it("test post_bridge, delegate candidate_email to send_offer", async function(){
        const send_offer_mock = sinon.fake()
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Account, "model", {})
        sinon.replace(Agreement, "model", {})
        sinon.replace(Contract_Service, "encryption", sinon.fake())
        sinon.replace(Account.prototype, "findOne", sinon.fake.returns({name:"dummy"}) )
        sinon.replace(Agreement.prototype, "create", sinon.fake.returns({id:null}))
        sinon.replace(Email_Service.prototype, "send_offer", send_offer_mock)    

        const response = await Offer_Bridge.post_bridge(null, null, null, null, 
            null, null, null, null, null)
        
        expect(send_offer_mock.args[0][1]).to.equal("dummy")
    })

    it("test post_bridge, delegate candidate_email to send_offer", async function(){
        const send_offer_mock = sinon.fake()
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Account, "model", {})
        sinon.replace(Agreement, "model", {})
        sinon.replace(Contract_Service, "encryption", sinon.fake())
        sinon.replace(Account.prototype, "findOne", sinon.fake.returns({name:null}) )
        sinon.replace(Agreement.prototype, "create", sinon.fake.returns({id:null}))
        sinon.replace(Email_Service.prototype, "send_offer", send_offer_mock)    

        const response = await Offer_Bridge.post_bridge(null, null, null, "dummy", 
            null, null, null, null, null)
        
        expect(send_offer_mock.args[0][2]).to.equal("dummy")
    })

    it("test post_bridge, delegate job_title to send_offer", async function(){
        const send_offer_mock = sinon.fake()
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Account, "model", {})
        sinon.replace(Agreement, "model", {})
        sinon.replace(Contract_Service, "encryption", sinon.fake())
        sinon.replace(Account.prototype, "findOne", sinon.fake.returns({name:null}) )
        sinon.replace(Agreement.prototype, "create", sinon.fake.returns({id:null}))
        sinon.replace(Email_Service.prototype, "send_offer", send_offer_mock)    

        const response = await Offer_Bridge.post_bridge("dummy", null, null, null, 
            null, null, null, null, null)
        
        expect(send_offer_mock.args[0][3]).to.equal("dummy")
    })

    it("test post_bridge, delegate password to send_offer", async function(){
        const send_offer_mock = sinon.fake()
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Account, "model", {})
        sinon.replace(Agreement, "model", {})
        sinon.replace(Contract_Service, "encryption", sinon.fake())
        sinon.replace(Account.prototype, "findOne", sinon.fake.returns({name:null}) )
        sinon.replace(Agreement.prototype, "create", sinon.fake.returns({id:null}))
        sinon.replace(Email_Service.prototype, "send_offer", send_offer_mock)    

        const response = await Offer_Bridge.post_bridge(null, null, null, null, 
            null, null, "dummy", null, null)
        
        expect(send_offer_mock.args[0][4]).to.equal("dummy")
    })

    it("test post_bridge, delegate contract_name to send_offer", async function(){
        const send_offer_mock = sinon.fake()
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Account, "model", {})
        sinon.replace(Agreement, "model", {})
        sinon.replace(Contract_Service, "encryption", sinon.fake())
        sinon.replace(Account.prototype, "findOne", sinon.fake.returns({name:null}) )
        sinon.replace(Agreement.prototype, "create", sinon.fake.returns({id:null}))
        sinon.replace(Email_Service.prototype, "send_offer", send_offer_mock)    

        const response = await Offer_Bridge.post_bridge(null, null, null, null, 
            "dummy", null, null, null, null)
        
        expect(send_offer_mock.args[0][5]).to.equal("dummy")
    })

    it("test post_bridge, delegate encrypted_buffer to send_offer", async function(){
        const send_offer_mock = sinon.fake()
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Account, "model", {})
        sinon.replace(Agreement, "model", {})
        sinon.replace(Contract_Service, "encryption", sinon.fake.returns("dummy"))
        sinon.replace(Account.prototype, "findOne", sinon.fake.returns({name:null}) )
        sinon.replace(Agreement.prototype, "create", sinon.fake.returns({id:null}))
        sinon.replace(Email_Service.prototype, "send_offer", send_offer_mock)    

        const response = await Offer_Bridge.post_bridge(null, null, null, null, 
            null, null, null, null, null)
        
        expect(send_offer_mock.args[0][6]).to.equal("dummy")
    })

    it("test post_bridge, successfully created, return expected response", async function(){
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Account, "model", {})
        sinon.replace(Agreement, "model", {})
        sinon.replace(Contract_Service, "encryption", sinon.fake())
        sinon.replace(Account.prototype, "findOne", sinon.fake.returns({name:null}) )
        sinon.replace(Agreement.prototype, "create", sinon.fake.returns({id: "dummy", createdAt: "random"}))
        sinon.replace(Email_Service.prototype, "send_offer", sinon.fake())    

        const response = await Offer_Bridge.post_bridge(null, null, null, null, 
            null, null, null, null, null)
        
        expect(response).to.eql({id: "dummy", createdAt: "random"})
    })

    it("test get_bridge, account_type is INDIVIDUAL, query_key=candidate_email", async function(){
        const mock = sinon.fake.returns([agreement_obj()])
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "isIterable", sinon.fake.returns(false))
        sinon.replace(Agreement.prototype, "findAll", mock)

        const response = await Offer_Bridge.get_bridge(null, 'INDIVIDUAL', null, null)

        expect('candidate_email' in mock.args[0][0]).to.equal(true)
    })

    it("test get_bridge, account_type is not INDIVIDUAL, query_key=candidate_email", async function(){
        const mock = sinon.fake.returns([agreement_obj()])
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "isIterable", sinon.fake.returns(false))
        sinon.replace(Agreement.prototype, "findAll", mock)

        const response = await Offer_Bridge.get_bridge(null, 'sdfdsfsdf', null, null)

        expect('company_email' in mock.args[0][0]).to.equal(true)
    })

    it("test get_bridge, empty querylist, status with no elements", async function(){
        const mock = sinon.fake.returns([agreement_obj()])
        sinon.replace(Agreement, "model", {})
        sinon.replace(Agreement.prototype, "findAll", mock)

        const response = await Offer_Bridge.get_bridge(null, null, null, null)

        expect(mock.args[0][0].status).to.eql(["REQ_REVIEW", "REQ_SIGN", "COMPLETED", "REJECTED", "REMOVED", "REQ_MODIFY", "TERMINATED"] )
    })

    it("test get_bridge, querylist with not matched type, status with no elements", async function(){
        const mock = sinon.fake.returns([agreement_obj()])
        sinon.replace(Agreement, "model", {})
        sinon.replace(Agreement.prototype, "findAll", mock)

        const response = await Offer_Bridge.get_bridge(null, null, ['random', 'dummy', 'req_review'], null)

        expect(mock.args[0][0].status).to.eql(["REQ_REVIEW", "REQ_SIGN", "COMPLETED", "REJECTED", "REMOVED", "REQ_MODIFY", "TERMINATED"] )
    })

    it("test get_bridge, querylist with one matched type, status with one elements", async function(){
        const mock = sinon.fake.returns([agreement_obj()])
        sinon.replace(Agreement, "model", {})
        sinon.replace(Agreement.prototype, "findAll", mock)

        const response = await Offer_Bridge.get_bridge(null, null, ['COMPLETED', 'dummy', 'req_review'], null)

        expect(mock.args[0][0].status).to.eql(["COMPLETED"])
    })

    it("test get_bridge, querylist with two matched type, status with two elements", async function(){
        const mock = sinon.fake.returns([agreement_obj()])
        sinon.replace(Agreement, "model", {})
        sinon.replace(Agreement.prototype, "findAll", mock)

        const response = await Offer_Bridge.get_bridge(null, null, ['COMPLETED', 'dummy', 'req_review', 'REQ_SIGN', 'sdf', null, 3432], null)

        expect(mock.args[0][0].status).to.eql(["COMPLETED", "REQ_SIGN"])
    })

    it("test get_bridge, delegate email to agreement_db.findAll, status with two elements", async function(){
        const mock = sinon.fake.returns([agreement_obj()])
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "isIterable", sinon.fake.returns(false))
        sinon.replace(Agreement.prototype, "findAll", mock)

        const response = await Offer_Bridge.get_bridge('dummy', null, null, null)

        expect(mock.args[0][0].company_email).to.equal("dummy")
    })

    it("test get_bridge, with no data returned, return modified data", async function(){
        const mock = sinon.fake.returns([])
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "isIterable", sinon.fake.returns(false))
        sinon.replace(Agreement.prototype, "findAll", mock)

        const response = await Offer_Bridge.get_bridge(null, null, ['COMPLETED', 'dummy', 'req_review', 'REQ_SIGN', 'sdf', null, 3432], null)

        expect(response.data).to.eql([])
    })

    it("test get_bridge, with one data returned, return modified data", async function(){
        const mock = sinon.fake.returns([agreement_obj('id', "job_title", "company_email", "candidate_email", "status", "updatedAt", "job_description", "createdAt", null, null, "1234")])
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "isIterable", sinon.fake.returns(false))
        sinon.replace(Agreement.prototype, "findAll", mock)

        const response = await Offer_Bridge.get_bridge(null, null, ['COMPLETED', 'dummy', 'req_review', 'REQ_SIGN', 'sdf', null, 3432], null)

        expect(response.data).to.eql([{token_id:undefined, cid:"1234", company_email: "company_email", id: "id", job_title:"job_title", job_description: "job_description", candidate_email: "candidate_email", status: "status", updatedAt: "updatedAt", createdAt: "createdAt"}])
    })

    it("test get_bridge, with two data returned, return modified data", async function(){
        const mock = sinon.fake.returns([
            agreement_obj('id', "job_title", "company_email", "candidate_email", "status", "updatedAt", "job_description", "createdAt", null,null, '1234'),
            agreement_obj('id2', "job_title2", "company_email2", "candidate_email2", "status2", "updatedAt2", "job_description2", "createdAt2", null, null, '1234')
        ])
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "isIterable", sinon.fake.returns(false))
        sinon.replace(Agreement.prototype, "findAll", mock)

        const response = await Offer_Bridge.get_bridge(null, 'INDIVIDUAL', ['COMPLETED', 'dummy', 'req_review', 'REQ_SIGN', 'sdf', null, 3432], null)

        expect(response.data).to.eql([
            {token_id:undefined, cid:"1234", id: "id", job_title:"job_title", job_description: "job_description", candidate_email:'candidate_email', company_email: "company_email", status: "status", updatedAt: "updatedAt", createdAt: "createdAt"}
            ,{token_id:undefined, cid:"1234", id: "id2", job_title:"job_title2", job_description: "job_description2", candidate_email:'candidate_email2', company_email: "company_email2", status: "status2", updatedAt: "updatedAt2", createdAt: "createdAt2"}
        ])
    })

    it("test get_bridge, with two data returned, return with item count", async function(){
        const mock = sinon.fake.returns([
            agreement_obj('id', "job_title", "company_email", "candidate_email", "status", "updatedAt"),
            agreement_obj('id2', "job_title2", "company_email2", "candidate_email2", "status2", "updatedAt2")
        ])
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "isIterable", sinon.fake.returns(false))
        sinon.replace(Agreement.prototype, "findAll", mock)

        const response = await Offer_Bridge.get_bridge(null, 'INDIVIDUAL', ['COMPLETED', 'dummy', 'req_review', 'REQ_SIGN', 'sdf', null, 3432], null)

        expect(response.item_count).to.equal(2)
    })

    it("test get_bridge, with both REQ_SIGN and SIGNED in query, return all filtered items", async function(){
        const mock = sinon.fake.returns([
            agreement_obj('id', "job_title", "company_email", "candidate_email", "status", "updatedAt"),
            agreement_obj('id2', "job_title2", "company_email2", "candidate_email2", "status2", "updatedAt2")
        ])
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "isIterable", sinon.fake.returns(true))
        sinon.replace(Agreement.prototype, "findAll", mock)

        const response = await Offer_Bridge.get_bridge(null, 'INDIVIDUAL', ['SIGNED', 'REQ_SIGN'], null)

        expect(response.item_count).to.equal(2)
    })

    it("test get_bridge, with SIGNED only, return only filtered items of REQ_SIGN with sig signed", async function(){
        const mock = sinon.fake.returns([
            agreement_obj('id', "job_title", "company_email", "candidate_email", "REQ_SIGN", "updatedAt", '1234','1234','4567'),
            agreement_obj('id2', "job_title2", "company_email2", "candidate_email2", "REQ_SIGN", "updatedAt2")
        ])
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "isIterable", sinon.fake.returns(true))
        sinon.replace(Agreement.prototype, "findAll", mock)

        const response = await Offer_Bridge.get_bridge(null, 'INDIVIDUAL', ['SIGNED'], null)

        expect(response.item_count).to.equal(1)
        expect(response.data[0].id).to.equal('id')
    })

    it("test get_bridge, with REQ_SIGN only, return only filtered items of REQ_SIGN without sig signed", async function(){
        const mock = sinon.fake.returns([
            agreement_obj('id', "job_title", "company_email", "candidate_email", "REQ_SIGN", "updatedAt", '1234','1234','4567'),
            agreement_obj('id2', "job_title2", "company_email2", "candidate_email2", "REQ_SIGN", "updatedAt2")
        ])
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "isIterable", sinon.fake.returns(true))
        sinon.replace(Agreement.prototype, "findAll", mock)

        const response = await Offer_Bridge.get_bridge(null, 'INDIVIDUAL', ['REQ_SIGN'], null)

        expect(response.item_count).to.equal(1)
        expect(response.data[0].id).to.equal('id2')
    })

    it("test get_contract_bridge, delegate id to mandatory_field_checking", async function(){
        const mock = sinon.fake()
        sinon.replace(Util_Service, "mandatory_field_checking", mock)
        sinon.replace(Agreement, "model", {})
        sinon.replace(Agreement.prototype, "findOne", sinon.fake())
        sinon.replace(Contract_Service, "get_contract", sinon.fake())

        const response = await Offer_Bridge.get_contract_bridge("dummy", null, null)

        expect(mock.args[0][0]).to.eql({id: "dummy"})
    })

    it("test get_contract_bridge, delegate id to get_contract", async function(){
        const mock = sinon.fake()
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Agreement, "model", {})
        sinon.replace(Agreement.prototype, "findOne", sinon.fake())
        sinon.replace(Contract_Service, "get_contract", mock)

        const response = await Offer_Bridge.get_contract_bridge("dummy", null, null)

        expect(mock.args[0][0]).to.equal("dummy")
    })

    it("test get_contract_bridge, delegate email to get_contract", async function(){
        const mock = sinon.fake()
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Agreement, "model", {})
        sinon.replace(Agreement.prototype, "findOne", sinon.fake())
        sinon.replace(Contract_Service, "get_contract", mock)

        const response = await Offer_Bridge.get_contract_bridge(null, "dummy", null)

        expect(mock.args[0][1]).to.equal("dummy")
    })

    it("test get_contract_bridge, delegate db to get_contract", async function(){
        const mock = sinon.fake()
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Agreement, "model", {})
        sinon.replace(Agreement.prototype, "findOne", sinon.fake())
        sinon.replace(Contract_Service, "get_contract", mock)

        const response = await Offer_Bridge.get_contract_bridge(null, "dummy", null)

        expect(mock.args[0][2] instanceof Agreement).to.equal(true)
    })

    it("test get_contract_bridge, success, return return value of get_contract", async function(){
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Agreement, "model", {})
        sinon.replace(Agreement.prototype, "findOne", sinon.fake())
        sinon.replace(Contract_Service, "get_contract", sinon.fake.returns("random"))

        const response = await Offer_Bridge.get_contract_bridge(null, "dummy", null)

        expect(response).to.equal("random")
    })

    it("test get_offer_bridge, delegate id to get_contract", async function(){
        const mock = sinon.fake.returns(agreement_obj('id', "job_title", "company_email", "candidate_email", "status", "updatedAt"))
        sinon.replace(Agreement, "model", {})
        sinon.replace(Agreement.prototype, "findOne", sinon.fake())
        sinon.replace(Contract_Service, "get_record", mock)

        const response = await Offer_Bridge.get_offer_bridge("dummy", null, null, null)

        expect(mock.args[0][0]).to.equal("dummy")
    })

    it("test get_offer_bridge, delegate email to get_contract", async function(){
        const mock = sinon.fake.returns(agreement_obj('id', "job_title", "company_email", "candidate_email", "status", "updatedAt"))
        sinon.replace(Agreement, "model", {})
        sinon.replace(Agreement.prototype, "findOne", sinon.fake())
        sinon.replace(Contract_Service, "get_record", mock)

        const response = await Offer_Bridge.get_offer_bridge(null, "dummy", null, null)

        expect(mock.args[0][1]).to.equal("dummy")
    })

    it("test get_offer_bridge, delegate db to get_contract", async function(){
        const mock = sinon.fake.returns(agreement_obj('id', "job_title", "company_email", "candidate_email", "status", "updatedAt"))
        sinon.replace(Agreement, "model", {})
        sinon.replace(Agreement.prototype, "findOne", sinon.fake())
        sinon.replace(Contract_Service, "get_record", mock)

        const response = await Offer_Bridge.get_offer_bridge(null, "dummy", null, null)

        expect(mock.args[0][2] instanceof Agreement).to.equal(true)
    })

    it("test get_offer_bridge, success, return return value of get_contract", async function(){
        const mock = sinon.fake.returns(agreement_obj('id', "job_title", "company_email", "candidate_email", "status", "updatedAt", "job_description", "createdAt", null, null, '1234'))
        sinon.replace(Agreement, "model", {})
        sinon.replace(Agreement.prototype, "findOne", sinon.fake())
        sinon.replace(Contract_Service, "get_record", mock)

        const response = await Offer_Bridge.get_offer_bridge(null, "dummy", null, null)

        expect(response).to.eql({token_id: undefined, cid:"1234", company_email: "company_email", id: "id", job_title:"job_title", job_description: "job_description", candidate_email: "candidate_email", status: "status", updatedAt: "updatedAt", createdAt: "createdAt"})
    })

    it("test get_offer_bridge, current signature exist and status is REQ_SIGN, return SIGNED status", async function(){
        const mock = sinon.fake.returns(agreement_obj('id', "job_title", "company_email", "candidate_email", "REQ_SIGN", "updatedAt", "job_description", "createdAt", '1234'))
        sinon.replace(Agreement, "model", {})
        sinon.replace(Agreement.prototype, "findOne", sinon.fake())
        sinon.replace(Contract_Service, "get_record", mock)

        const response = await Offer_Bridge.get_offer_bridge(null, "dummy", 'INDIVIDUAL', null)

        expect(response.status).to.equal("SIGNED")
    })

    it("test put_accept_bridge, delegate offer_id to mandatory_field_checking", async function(){
        const mock = sinon.fake()
        sinon.replace(Util_Service, "mandatory_field_checking", mock)
        sinon.replace(Agreement, "model", {})
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({status:""}))

        try{ await Offer_Bridge.put_accept_bridge('offer_id', null, null, null) }
        catch(err){}

        expect(mock.args[0][0]).to.eql({id: 'offer_id'})
    })

    it("test put_accept_bridge, delegate offer_id to get_record", async function(){
        const mock = sinon.fake.returns({status:""})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Agreement, "model", {})
        sinon.replace(Contract_Service, "get_record", mock)

        try{ await Offer_Bridge.put_accept_bridge('offer_id', null, null, null, null, null) }
        catch(err){}

        expect(mock.args[0][0]).to.equal('offer_id')
    })

    it("test put_accept_bridge, delegate user_email to get_record", async function(){
        const mock = sinon.fake.returns({status:""})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Agreement, "model", {})
        sinon.replace(Contract_Service, "get_record", mock)

        try{ await Offer_Bridge.put_accept_bridge(null, null, null, 'user_email', null, null) }
        catch(err){}

        expect(mock.args[0][1]).to.equal('user_email')
    })

    it("test put_accept_bridge, delegate agreement_db to get_record", async function(){
        const mock = sinon.fake.returns({status:""})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Agreement, "model", {})
        sinon.replace(Contract_Service, "get_record", mock)

        try{ await Offer_Bridge.put_accept_bridge(null, null, null, null, null, null) }
        catch(err){}

        expect(mock.args[0][2] instanceof Agreement).to.equal(true)
    })

    it("test put_accept_bridge, account_type not individual, throw error status 400", async function(){
        var error
        const mock = sinon.fake.returns({status:""})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Agreement, "model", {})
        sinon.replace(Contract_Service, "get_record", mock)

        try{ await Offer_Bridge.put_accept_bridge(null, null, null, null, null, null) }
        catch(err){ error=err }

        expect(error.get_status()).to.equal(400)
    })

    it("test put_accept_bridge, account_type not individual, throw error message", async function(){
        var error
        const mock = sinon.fake.returns({status:""})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Agreement, "model", {})
        sinon.replace(Contract_Service, "get_record", mock)

        try{ await Offer_Bridge.put_accept_bridge(null, null, null, null, null, null)}
        catch(err){ error=err }

        expect(error.get_payload()).to.eql({message: "Only for Individual account"})
    })

    it("test put_accept_bridge, status not REQ_REVIEW, throw error status 400", async function(){
        var error
        const mock = sinon.fake.returns({status:""})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Agreement, "model", {})
        sinon.replace(Contract_Service, "get_record", mock)

        try{ await Offer_Bridge.put_accept_bridge(null, 'INDIVIDUAL', null, null, null, null) }
        catch(err){ error=err }

        expect(error.get_status()).to.equal(400)
    })

    it("test put_accept_bridge, status not REQ_REVIEW, throw error message", async function(){
        var error
        const mock = sinon.fake.returns({status:""})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Agreement, "model", {})
        sinon.replace(Contract_Service, "get_record", mock)

        try{ await Offer_Bridge.put_accept_bridge(null, 'INDIVIDUAL', null, null, null, null) }
        catch(err){ error=err }

        expect(error.get_payload()).to.eql({message: "Only for offer with REQ_REVIEW status"})
    })

    it("test put_accept_bridge, delegate company_email to findOne", async function(){
        const mock = sinon.fake.returns({})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Agreement, "model", {})
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({status:"REQ_REVIEW", company_email: 'random', update: sinon.fake.returns({})}))
        sinon.replace(Account, "model", {})
        sinon.replace(Account.prototype, "findOne", mock)
        sinon.replace(Contract_Service, "add_ipfs", sinon.fake.returns(""))
        sinon.replace(Email_Service.prototype, "send_alert", sinon.fake.returns(""))

        await Offer_Bridge.put_accept_bridge(null, 'INDIVIDUAL', null, null, null, null)

        expect(mock.args[0][0]).to.eql({email: 'random'})
    })

    it("test put_accept_bridge, delegate contract buffer to add_ipfs", async function(){
        const mock = sinon.fake.returns("")
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Agreement, "model", {})
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({status:"REQ_REVIEW", company_email: 'random', update: sinon.fake.returns({}), contract:"con"}))
        sinon.replace(Account, "model", {})
        sinon.replace(Account.prototype, "findOne", sinon.fake.returns({}))
        sinon.replace(Contract_Service, "add_ipfs", mock)
        sinon.replace(Email_Service.prototype, "send_alert", sinon.fake.returns(""))

        await Offer_Bridge.put_accept_bridge(null, 'INDIVIDUAL', null, null, null, null)

        expect(mock.args[0][0]).to.equal("con")
    })

    it("test put_accept_bridge, delegate contract buffer to add_ipfs", async function(){
        const mock = sinon.fake.returns("")
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Agreement, "model", {})
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({
            status:"REQ_REVIEW", 
            company_email: 'random', 
            update: sinon.fake.returns({}),
            job_title:"job_title",
            job_description:"job_description"
        }))
        sinon.replace(Account, "model", {})
        sinon.replace(Account.prototype, "findOne", sinon.fake.returns({name:"name"}))
        sinon.replace(Contract_Service, "add_ipfs", mock)
        sinon.replace(Email_Service.prototype, "send_alert", sinon.fake.returns(""))

        await Offer_Bridge.put_accept_bridge(null, 'INDIVIDUAL', 'rnadom name', null, 'dummy', null)

        expect(mock.args[0][1]).to.eql({
            details: {
                job_title: 'job_title',
                job_description: 'job_description'
            },
            employee:{
                employee_id: 'dummy', 
                employee_name: 'rnadom name'
            },
            employer:{
                employer_name: 'name'
            },
            createdAt: currentTimeStamp,
        })
    })
    
    it("test put_accept_bridge, delegate company_record.email buffer to send_alert", async function(){
        const mock = sinon.fake.returns("")
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Agreement, "model", {})
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({status:"REQ_REVIEW", company_email: 'random', update: sinon.fake.returns({})}))
        sinon.replace(Account, "model", {})
        sinon.replace(Account.prototype, "findOne", sinon.fake.returns({email:"random"}))
        sinon.replace(Contract_Service, "add_ipfs", sinon.fake.returns(""))
        sinon.replace(Email_Service.prototype, "send_alert",mock )

        await Offer_Bridge.put_accept_bridge(null, 'INDIVIDUAL', null, null, null, null)

        expect(mock.args[0][0]).to.equal("random")
    })
    
    it("test put_accept_bridge, delegate company_record.name buffer to send_alert", async function(){
        const mock = sinon.fake.returns("")
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Agreement, "model", {})
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({status:"REQ_REVIEW", company_email: 'random', update: sinon.fake.returns({})}))
        sinon.replace(Account, "model", {})
        sinon.replace(Account.prototype, "findOne", sinon.fake.returns({name:"random"}))
        sinon.replace(Contract_Service, "add_ipfs", sinon.fake.returns(""))
        sinon.replace(Email_Service.prototype, "send_alert",mock )

        await Offer_Bridge.put_accept_bridge(null, 'INDIVIDUAL', null, null, null, null)

        expect(mock.args[0][1]).to.equal("random")
    })
    
    it("test put_accept_bridge, delegate user_name buffer to send_alert", async function(){
        const mock = sinon.fake.returns("")
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Agreement, "model", {})
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({status:"REQ_REVIEW", company_email: 'random', update: sinon.fake.returns({})}))
        sinon.replace(Account, "model", {})
        sinon.replace(Account.prototype, "findOne", sinon.fake.returns({}))
        sinon.replace(Contract_Service, "add_ipfs", sinon.fake.returns(""))
        sinon.replace(Email_Service.prototype, "send_alert",mock )

        await Offer_Bridge.put_accept_bridge(null, 'INDIVIDUAL', "random", null, null, null)

        expect(mock.args[0][2]).to.equal("random")
    })
    
    it("test put_accept_bridge, delegate offer_id to send_alert", async function(){
        const mock = sinon.fake.returns("")
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Agreement, "model", {})
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({status:"REQ_REVIEW", company_email: 'random', update: sinon.fake.returns({})}))
        sinon.replace(Account, "model", {})
        sinon.replace(Account.prototype, "findOne", sinon.fake.returns({}))
        sinon.replace(Contract_Service, "add_ipfs", sinon.fake.returns(""))
        sinon.replace(Email_Service.prototype, "send_alert",mock )

        await Offer_Bridge.put_accept_bridge("random", 'INDIVIDUAL', null, null, null, null)

        expect(mock.args[0][3]).to.equal("random")
    })
    
    it("test put_accept_bridge, delegate REQ_SIGN to send_alert", async function(){
        const mock = sinon.fake.returns("")
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Agreement, "model", {})
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({status:"REQ_REVIEW", company_email: 'random', update: sinon.fake.returns({})}))
        sinon.replace(Account, "model", {})
        sinon.replace(Account.prototype, "findOne", sinon.fake.returns({}))
        sinon.replace(Contract_Service, "add_ipfs", sinon.fake.returns(""))
        sinon.replace(Email_Service.prototype, "send_alert",mock )

        await Offer_Bridge.put_accept_bridge(null, 'INDIVIDUAL', null, null, null, null)

        expect(mock.args[0][4]).to.equal("REQ_SIGN")
    })
    
    it("test put_accept_bridge, delegate query to update", async function(){
        const mock = sinon.fake.returns({})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Agreement, "model", {})
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({status:"REQ_REVIEW", company_email: 'random', update: mock}))
        sinon.replace(Account, "model", {})
        sinon.replace(Account.prototype, "findOne", sinon.fake.returns({}))
        sinon.replace(Contract_Service, "add_ipfs", sinon.fake.returns("sdfsdf"))
        sinon.replace(Email_Service.prototype, "send_alert", sinon.fake.returns("") )

        await Offer_Bridge.put_accept_bridge(null, 'INDIVIDUAL', null, null, null, null)

        expect(mock.args[0][0]).to.eql({status: 'REQ_SIGN', cid: 'sdfsdf'})
    })
    
    it("test put_accept_bridge, return expected obj", async function(){
        const mock = sinon.fake.returns({
            id: "id",
            cid:"cid",
            job_title: "job_title",
            job_description: "job_description",
            candidate_email: "candidate_email",
            company_email: 'company_email',
            status: "status",
            updatedAt: "updatedAt",
            createdAt: "createdAt"
        })
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Agreement, "model", {})
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({status:"REQ_REVIEW", company_email: 'random', update: mock}))
        sinon.replace(Account, "model", {})
        sinon.replace(Account.prototype, "findOne", sinon.fake.returns({}))
        sinon.replace(Contract_Service, "add_ipfs", sinon.fake.returns("sdfsdf"))
        sinon.replace(Email_Service.prototype, "send_alert", sinon.fake.returns("") )

        const response = await Offer_Bridge.put_accept_bridge(null, 'INDIVIDUAL', null, null, null, null)

        expect(response).to.eql({            
            id: 'id',
            cid: 'cid', 
            job_title: 'job_title',
            job_description: 'job_description',
            candidate_email: 'candidate_email',
            company_email: 'company_email',
            token_id: undefined,
            status: 'status',
            updatedAt: 'updatedAt',
            createdAt: 'createdAt'
        })
    })

    it("test put_modify_bridge, delegate offer_id to mandatory_field_checking", async function(){
        const mock = sinon.fake()
        sinon.replace(Util_Service, "mandatory_field_checking", mock)
        sinon.replace(Agreement, "model", {})
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({status:""}))

        try{ await Offer_Bridge.put_modify_bridge('offer_id', null, null, null, null, null, null, null, null) }
        catch(err){}

        expect(mock.args[0][0]).to.eql({id: 'offer_id'})
    })

    it("test put_modify_bridge, delegate offer_id to get_record", async function(){
        const mock = sinon.fake.returns({status:""})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Agreement, "model", {})
        sinon.replace(Contract_Service, "get_record", mock)

        try{ await Offer_Bridge.put_modify_bridge('offer_id', null, null, null, null, null, null, null, null) }
        catch(err){}

        expect(mock.args[0][0]).to.equal('offer_id')
    })

    it("test put_modify_bridge, delegate user_email to get_record", async function(){
        const mock = sinon.fake.returns({status:""})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Agreement, "model", {})
        sinon.replace(Contract_Service, "get_record", mock)

        try{ await Offer_Bridge.put_modify_bridge(null, null, 'user_email', null, null, null, null, null, null) }
        catch(err){}

        expect(mock.args[0][1]).to.equal('user_email')
    })

    it("test put_modify_bridge, delegate agreement_db to get_record", async function(){
        const mock = sinon.fake.returns({status:""})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Agreement, "model", {})
        sinon.replace(Contract_Service, "get_record", mock)

        try{ await Offer_Bridge.put_modify_bridge(null, null, null, null, null, null,null, null, null) }
        catch(err){}

        expect(mock.args[0][2] instanceof Agreement).to.equal(true)
    })

    it("test put_modify_bridge, INDIVIDUAL account with offer status not REQ_REVIEW, throw error with code 400", async function(){
        var error
        const mock = sinon.fake.returns({status:""})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Agreement, "model", {})
        sinon.replace(Contract_Service, "get_record", mock)

        try{ await Offer_Bridge.put_modify_bridge(null, 'INDIVIDUAL', null, null, null, null,null, null, null) }
        catch(err){ error=err }

        expect(error.get_status()).to.equal(400)
    })

    it("test put_modify_bridge, INDIVIDUAL account with offer status not REQ_REVIEW, throw error with err msg", async function(){
        var error
        const mock = sinon.fake.returns({status:""})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Agreement, "model", {})
        sinon.replace(Contract_Service, "get_record", mock)

        try{ await Offer_Bridge.put_modify_bridge(null, 'INDIVIDUAL', null, null, null, null,null, null, null) }
        catch(err){ error=err }

        expect(error.get_payload()).to.eql({message: "Only for offer with REQ_REVIEW status"})
    })

    it("test put_modify_bridge, BUSINESS account with offer status not REQ_MODIFY, throw error with 400 status", async function(){
        var error
        const mock = sinon.fake.returns({status:""})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Agreement, "model", {})
        sinon.replace(Contract_Service, "get_record", mock)

        try{ await Offer_Bridge.put_modify_bridge(null, 'BUSINESS', null, null, null, null,null, null, null) }
        catch(err){ error=err }

        expect(error.get_status()).to.equal(400)
    })

    it("test put_modify_bridge, BUSINESS account with offer status not REQ_MODIFY, throw error with err msg", async function(){
        var error
        const mock = sinon.fake.returns({status:""})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Agreement, "model", {})
        sinon.replace(Contract_Service, "get_record", mock)

        try{ await Offer_Bridge.put_modify_bridge(null, 'BUSINESS', null, null, null, null,null, null, null) }
        catch(err){ error=err }

        expect(error.get_payload()).to.eql({message: "Only for offer with REQ_MODIFY status"})
    })

    it("test put_modify_bridge, INDIVIDUAL with status REQ_REVIEW, delegate query to findOne", async function(){
        const mock = sinon.fake.returns({})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Agreement, "model", {})
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({status:"REQ_REVIEW", company_email:"dummy", update: sinon.fake()}))
        sinon.replace(Account, "model", {})
        sinon.replace(Account.prototype, "findOne", mock)
        sinon.replace(Email_Service.prototype, "send_alert", sinon.fake())
        sinon.replace(Handler, "agreement_payload_handle", sinon.fake())

        await Offer_Bridge.put_modify_bridge(null, 'INDIVIDUAL', null, null, null, null,null, null, null)

        expect(mock.args[0][0]).to.eql({email: 'dummy'})
    })

    it("test put_modify_bridge, INDIVIDUAL with status REQ_REVIEW, delegate query to update", async function(){
        const mock = sinon.fake()
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Agreement, "model", {})
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({status:"REQ_REVIEW", update: mock}))
        sinon.replace(Account, "model", {})
        sinon.replace(Account.prototype, "findOne", sinon.fake.returns({}))
        sinon.replace(Email_Service.prototype, "send_alert", sinon.fake())
        sinon.replace(Handler, "agreement_payload_handle", sinon.fake())

        await Offer_Bridge.put_modify_bridge(null, 'INDIVIDUAL', null, null, null, null,null, null, null)

        expect(mock.args[0][0]).to.eql({status: 'REQ_MODIFY'})
    })

    it("test put_modify_bridge, INDIVIDUAL with status REQ_REVIEW, delegate company_record.email to send_alert", async function(){
        const mock = sinon.fake()
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Agreement, "model", {})
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({status:"REQ_REVIEW", update: sinon.fake()}))
        sinon.replace(Account, "model", {})
        sinon.replace(Account.prototype, "findOne", sinon.fake.returns({email:"random"}))
        sinon.replace(Email_Service.prototype, "send_alert", mock)
        sinon.replace(Handler, "agreement_payload_handle", sinon.fake())

        await Offer_Bridge.put_modify_bridge(null, 'INDIVIDUAL', null, null, null, null,null, null, null)

        expect(mock.args[0][0]).to.equal("random")
    })

    it("test put_modify_bridge, INDIVIDUAL with status REQ_REVIEW, delegate company_record.name to send_alert", async function(){
        const mock = sinon.fake()
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Agreement, "model", {})
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({status:"REQ_REVIEW", update: sinon.fake()}))
        sinon.replace(Account, "model", {})
        sinon.replace(Account.prototype, "findOne", sinon.fake.returns({name:"random"}))
        sinon.replace(Email_Service.prototype, "send_alert", mock)
        sinon.replace(Handler, "agreement_payload_handle", sinon.fake())

        await Offer_Bridge.put_modify_bridge(null, 'INDIVIDUAL', null, null, null, null,null, null, null)

        expect(mock.args[0][1]).to.equal("random")
    })

    it("test put_modify_bridge, INDIVIDUAL with status REQ_REVIEW, delegate user_name to send_alert", async function(){
        const mock = sinon.fake()
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Agreement, "model", {})
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({status:"REQ_REVIEW", update: sinon.fake()}))
        sinon.replace(Account, "model", {})
        sinon.replace(Account.prototype, "findOne", sinon.fake.returns({}))
        sinon.replace(Email_Service.prototype, "send_alert", mock)
        sinon.replace(Handler, "agreement_payload_handle", sinon.fake())

        await Offer_Bridge.put_modify_bridge(null, 'INDIVIDUAL', null, "random", null, null,null, null, null)

        expect(mock.args[0][2]).to.equal("random")
    })

    it("test put_modify_bridge, INDIVIDUAL with status REQ_REVIEW, delegate offer_id to send_alert", async function(){
        const mock = sinon.fake()
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Agreement, "model", {})
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({status:"REQ_REVIEW", update: sinon.fake()}))
        sinon.replace(Account, "model", {})
        sinon.replace(Account.prototype, "findOne", sinon.fake.returns({}))
        sinon.replace(Email_Service.prototype, "send_alert", mock)
        sinon.replace(Handler, "agreement_payload_handle", sinon.fake())

        await Offer_Bridge.put_modify_bridge("sdfsd", 'INDIVIDUAL', null, null, null, null,null, null, null)

        expect(mock.args[0][3]).to.equal("sdfsd")
    })

    it("test put_modify_bridge, INDIVIDUAL with status REQ_REVIEW, delegate REQ_MODIFY to send_alert", async function(){
        const mock = sinon.fake()
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Agreement, "model", {})
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({status:"REQ_REVIEW", update: sinon.fake()}))
        sinon.replace(Account, "model", {})
        sinon.replace(Account.prototype, "findOne", sinon.fake.returns({}))
        sinon.replace(Email_Service.prototype, "send_alert", mock)
        sinon.replace(Handler, "agreement_payload_handle", sinon.fake())

        await Offer_Bridge.put_modify_bridge(null, 'INDIVIDUAL', null, null, null, null,null, null, null)

        expect(mock.args[0][4]).to.equal("REQ_MODIFY")
    })

    it("test put_modify_bridge, INDIVIDUAL with status REQ_REVIEW, delegate extra_message to send_alert", async function(){
        const mock = sinon.fake()
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Agreement, "model", {})
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({status:"REQ_REVIEW", update: sinon.fake()}))
        sinon.replace(Account, "model", {})
        sinon.replace(Account.prototype, "findOne", sinon.fake.returns({}))
        sinon.replace(Email_Service.prototype, "send_alert", mock)
        sinon.replace(Handler, "agreement_payload_handle", sinon.fake())

        await Offer_Bridge.put_modify_bridge(null, 'INDIVIDUAL', null, null, null, null,null, null, null)

        expect(mock.args[0][5]).to.equal("Please modify the offer accordingly.")
    })

    it("test put_modify_bridge, INDIVIDUAL with status REQ_REVIEW, delegate new_record to agreement_payload_handle", async function(){
        const mock = sinon.fake()
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Agreement, "model", {})
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({status:"REQ_REVIEW", update: sinon.fake.returns('sdfsdf')}))
        sinon.replace(Account, "model", {})
        sinon.replace(Account.prototype, "findOne", sinon.fake.returns({}))
        sinon.replace(Email_Service.prototype, "send_alert", sinon.fake())
        sinon.replace(Handler, "agreement_payload_handle", mock)

        await Offer_Bridge.put_modify_bridge(null, 'INDIVIDUAL', null, null, null, null,null, null, null)

        expect(mock.args[0][0]).to.equal("sdfsdf")
    })
    
    it("test put_modify_bridge, INDIVIDUAL with status REQ_REVIEW, return return value of Handler", async function(){
        const mock = sinon.fake()
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Agreement, "model", {})
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({status:"REQ_REVIEW", update: sinon.fake()}))
        sinon.replace(Account, "model", {})
        sinon.replace(Account.prototype, "findOne", sinon.fake.returns({}))
        sinon.replace(Email_Service.prototype, "send_alert", mock)
        sinon.replace(Handler, "agreement_payload_handle", sinon.fake.returns("sdfsdfdsf"))

        const response = await Offer_Bridge.put_modify_bridge(null, 'INDIVIDUAL', null, null, null, null,null, null, null)

        expect(response).to.equal("sdfsdfdsf")
    })
    
    it("test put_modify_bridge, BUSINESS with status REQ_MODIFY without any params, delegate status to update", async function(){
        const mock = sinon.fake()
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Agreement, "model", {})
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({status:"REQ_MODIFY", update: mock}))
        sinon.replace(Account, "model", {})
        sinon.replace(Account.prototype, "findOne", sinon.fake.returns({}))
        sinon.replace(Email_Service.prototype, "send_alert", sinon.fake())
        sinon.replace(Handler, "agreement_payload_handle", sinon.fake())

        const response = await Offer_Bridge.put_modify_bridge(null, 'BUSINESS', null, null, null, null,null, null, null)

        expect(mock.args[0][0]).to.eql({status: 'REQ_REVIEW'})
    })
    
    it("test put_modify_bridge, BUSINESS with status REQ_MODIFY with job_title, delegate job_title to update", async function(){
        const mock = sinon.fake()
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Agreement, "model", {})
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({status:"REQ_MODIFY", update: mock}))
        sinon.replace(Account, "model", {})
        sinon.replace(Account.prototype, "findOne", sinon.fake.returns({}))
        sinon.replace(Email_Service.prototype, "send_alert", sinon.fake())
        sinon.replace(Handler, "agreement_payload_handle", sinon.fake())

        const response = await Offer_Bridge.put_modify_bridge(null, 'BUSINESS', null, null, null, 'dummy',null, null, null)

        expect(mock.args[0][0]).to.eql({status: 'REQ_REVIEW', job_title: 'dummy'})
    })

    it("test put_modify_bridge, BUSINESS with status REQ_MODIFY with job_description, delegate job_description to update", async function(){
        const mock = sinon.fake()
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Agreement, "model", {})
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({status:"REQ_MODIFY", update: mock}))
        sinon.replace(Account, "model", {})
        sinon.replace(Account.prototype, "findOne", sinon.fake.returns({}))
        sinon.replace(Email_Service.prototype, "send_alert", sinon.fake())
        sinon.replace(Handler, "agreement_payload_handle", sinon.fake())

        const response = await Offer_Bridge.put_modify_bridge(null, 'BUSINESS', null, null, null, null,'random', null, null)

        expect(mock.args[0][0]).to.eql({status: 'REQ_REVIEW', job_description: "random"})
    })

    it("test put_modify_bridge, BUSINESS with status REQ_MODIFY with contract_file & without password, throw error with status 400", async function(){
        var error
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Agreement, "model", {})
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({status:"REQ_MODIFY", update: sinon.fake()}))
        sinon.replace(Account, "model", {})
        sinon.replace(Account.prototype, "findOne", sinon.fake.returns({}))
        sinon.replace(Email_Service.prototype, "send_alert", sinon.fake())
        sinon.replace(Handler, "agreement_payload_handle", sinon.fake())

        try{ await Offer_Bridge.put_modify_bridge(null, 'BUSINESS', null, null, "file", null,null, null, null) }
        catch(err){ error=err }

        expect(error.get_status()).to.equal(400)
    })

    it("test put_modify_bridge, BUSINESS with status REQ_MODIFY with contract_file & without password, throw error msg", async function(){
        var error
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Agreement, "model", {})
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({status:"REQ_MODIFY", update: sinon.fake()}))
        sinon.replace(Account, "model", {})
        sinon.replace(Account.prototype, "findOne", sinon.fake.returns({}))
        sinon.replace(Email_Service.prototype, "send_alert", sinon.fake())
        sinon.replace(Handler, "agreement_payload_handle", sinon.fake())

        try{ await Offer_Bridge.put_modify_bridge(null, 'BUSINESS', null, null, "file", null,null, null, null) }
        catch(err){ error=err }

        expect(error.get_payload()).to.eql({message: "Missing password for newly upload contract"})
    })

    it("test put_modify_bridge, BUSINESS with status REQ_MODIFY with contract_file & password, delegate contract_file to encryption", async function(){
        const mock = sinon.fake()
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Agreement, "model", {})
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({status:"REQ_MODIFY", update: sinon.fake()}))
        sinon.replace(Account, "model", {})
        sinon.replace(Account.prototype, "findOne", sinon.fake.returns({}))
        sinon.replace(Email_Service.prototype, "send_alert", sinon.fake())
        sinon.replace(Handler, "agreement_payload_handle", sinon.fake())
        sinon.replace(Contract_Service, "encryption", mock)

        const response = await Offer_Bridge.put_modify_bridge(null, 'BUSINESS', null, null, 'file', null,null, 'password', null)

        expect(mock.args[0][0]).to.equal('file')
    })

    it("test put_modify_bridge, BUSINESS with status REQ_MODIFY with contract_file & password, delegate password to encryption", async function(){
        const mock = sinon.fake()
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Agreement, "model", {})
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({status:"REQ_MODIFY", update: sinon.fake()}))
        sinon.replace(Account, "model", {})
        sinon.replace(Account.prototype, "findOne", sinon.fake.returns({}))
        sinon.replace(Email_Service.prototype, "send_alert", sinon.fake())
        sinon.replace(Handler, "agreement_payload_handle", sinon.fake())
        sinon.replace(Contract_Service, "encryption", mock)

        const response = await Offer_Bridge.put_modify_bridge(null, 'BUSINESS', null, null, 'file', null,null, 'password', null)

        expect(mock.args[0][1]).to.equal('password')
    })

    it("test put_modify_bridge, BUSINESS with status REQ_MODIFY with contract_file & password, delegate password update", async function(){
        const mock = sinon.fake()
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Agreement, "model", {})
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({status:"REQ_MODIFY", update: mock}))
        sinon.replace(Account, "model", {})
        sinon.replace(Account.prototype, "findOne", sinon.fake.returns({}))
        sinon.replace(Email_Service.prototype, "send_alert", sinon.fake())
        sinon.replace(Handler, "agreement_payload_handle", sinon.fake())
        sinon.replace(Contract_Service, "encryption", sinon.fake.returns("enc"))

        const response = await Offer_Bridge.put_modify_bridge(null, 'BUSINESS', null, null, 'file', null,null, 'password', null)

        expect(mock.args[0][0]).to.eql({status: 'REQ_REVIEW', contract: "enc"})
    })

    it("test put_modify_bridge, BUSINESS with status REQ_MODIFY, delegate company_record.email to send_alert", async function(){
        const mock = sinon.fake()
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Agreement, "model", {})
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({status:"REQ_MODIFY", update: sinon.fake()}))
        sinon.replace(Account, "model", {})
        sinon.replace(Account.prototype, "findOne", sinon.fake.returns({email:'dummy'}))
        sinon.replace(Email_Service.prototype, "send_alert", mock)
        sinon.replace(Handler, "agreement_payload_handle", sinon.fake())
        sinon.replace(Contract_Service, "encryption", sinon.fake.returns("enc"))

        const response = await Offer_Bridge.put_modify_bridge(null, 'BUSINESS', null, null, 'file', null,null, 'password', null)

        expect(mock.args[0][0]).to.equal('dummy')
    })

    it("test put_modify_bridge, BUSINESS with status REQ_MODIFY, delegate company_record.name to send_alert", async function(){
        const mock = sinon.fake()
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Agreement, "model", {})
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({status:"REQ_MODIFY", update: sinon.fake()}))
        sinon.replace(Account, "model", {})
        sinon.replace(Account.prototype, "findOne", sinon.fake.returns({name:'dummy'}))
        sinon.replace(Email_Service.prototype, "send_alert", mock)
        sinon.replace(Handler, "agreement_payload_handle", sinon.fake())
        sinon.replace(Contract_Service, "encryption", sinon.fake.returns("enc"))

        const response = await Offer_Bridge.put_modify_bridge(null, 'BUSINESS', null, null, 'file', null,null, 'password', null)

        expect(mock.args[0][1]).to.equal('dummy')
    })

    it("test put_modify_bridge, BUSINESS with status REQ_MODIFY, delegate company_record.name to send_alert", async function(){
        const mock = sinon.fake()
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Agreement, "model", {})
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({status:"REQ_MODIFY", update: sinon.fake()}))
        sinon.replace(Account, "model", {})
        sinon.replace(Account.prototype, "findOne", sinon.fake.returns({name:'dummy'}))
        sinon.replace(Email_Service.prototype, "send_alert", mock)
        sinon.replace(Handler, "agreement_payload_handle", sinon.fake())

        const response = await Offer_Bridge.put_modify_bridge(null, 'BUSINESS', null, 'dummy', null, null,null, null, null)

        expect(mock.args[0][2]).to.equal('dummy')
    })

    it("test put_modify_bridge, BUSINESS with status REQ_MODIFY, delegate offer_id to send_alert", async function(){
        const mock = sinon.fake()
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Agreement, "model", {})
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({status:"REQ_MODIFY", update: sinon.fake()}))
        sinon.replace(Account, "model", {})
        sinon.replace(Account.prototype, "findOne", sinon.fake.returns({name:'dummy'}))
        sinon.replace(Email_Service.prototype, "send_alert", mock)
        sinon.replace(Handler, "agreement_payload_handle", sinon.fake())

        const response = await Offer_Bridge.put_modify_bridge('dummy', 'BUSINESS', null, null, null, null,null, null, null)

        expect(mock.args[0][3]).to.equal('dummy')
    })

    it("test put_modify_bridge, BUSINESS with status REQ_MODIFY, delegate REQ_REVIEW to send_alert", async function(){
        const mock = sinon.fake()
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Agreement, "model", {})
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({status:"REQ_MODIFY", update: sinon.fake()}))
        sinon.replace(Account, "model", {})
        sinon.replace(Account.prototype, "findOne", sinon.fake.returns({name:'dummy'}))
        sinon.replace(Email_Service.prototype, "send_alert", mock)
        sinon.replace(Handler, "agreement_payload_handle", sinon.fake())

        const response = await Offer_Bridge.put_modify_bridge(null, 'BUSINESS', null, null, null, null,null, null, null)

        expect(mock.args[0][4]).to.equal('REQ_REVIEW')
    })

    it("test put_modify_bridge, BUSINESS with status REQ_MODIFY, delegate extra_message", async function(){
        const mock = sinon.fake()
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Agreement, "model", {})
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({status:"REQ_MODIFY", update: sinon.fake()}))
        sinon.replace(Account, "model", {})
        sinon.replace(Account.prototype, "findOne", sinon.fake.returns({name:'dummy'}))
        sinon.replace(Email_Service.prototype, "send_alert", mock)
        sinon.replace(Handler, "agreement_payload_handle", sinon.fake())

        const response = await Offer_Bridge.put_modify_bridge(null, 'BUSINESS', null, null, null, null,null, null, null)

        expect(mock.args[0][5]).to.equal('The company has made an update to the offer, please check it in our home page. ')
    })

    it("test put_modify_bridge, BUSINESS with status REQ_MODIFY, delegate new_record to agreement_payload_handle", async function(){
        const mock = sinon.fake()
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Agreement, "model", {})
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({status:"REQ_MODIFY", update: sinon.fake.returns("haha")}))
        sinon.replace(Account, "model", {})
        sinon.replace(Account.prototype, "findOne", sinon.fake.returns({name:'dummy'}))
        sinon.replace(Email_Service.prototype, "send_alert", sinon.fake())
        sinon.replace(Handler, "agreement_payload_handle", mock)

        const response = await Offer_Bridge.put_modify_bridge(null, 'BUSINESS', null, null, null, null,null, null, null)

        expect(mock.args[0][0]).to.equal('haha')
    })

    it("test put_modify_bridge, BUSINESS with status REQ_MODIFY, delegate new_record to agreement_payload_handle", async function(){
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Agreement, "model", {})
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({status:"REQ_MODIFY", update: sinon.fake()}))
        sinon.replace(Account, "model", {})
        sinon.replace(Account.prototype, "findOne", sinon.fake.returns({name:'dummy'}))
        sinon.replace(Email_Service.prototype, "send_alert", sinon.fake())
        sinon.replace(Handler, "agreement_payload_handle", sinon.fake.returns("yo"))

        const response = await Offer_Bridge.put_modify_bridge(null, 'BUSINESS', null, null, null, null,null, null, null)

        expect(response).to.equal('yo')
    })

    it("test post_sign_bridge, delegate offer_id and signature to mandatory_field_checking", async function(){
        const mock = sinon.fake()
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", mock)
        sinon.replace(Contract_Service, "get_record", sinon.fake.throws(new Error()))

        try{ await Offer_Bridge.post_sign_bridge('random', 'sig', null, null) }
        catch(err){}

        expect(mock.args[0][0]).to.eql({id: 'random', secret: 'sig'})
    })

    it("test post_sign_bridge, delegate offer_id to get_record", async function(){
        const mock = sinon.fake.throws(new Error())
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Contract_Service, "get_record", mock)

        try{ await Offer_Bridge.post_sign_bridge('random', null, null, null) }
        catch(err){}

        expect(mock.args[0][0]).to.equal('random')
    })

    it("test post_sign_bridge, delegate user_email to get_record", async function(){
        const mock = sinon.fake.throws(new Error())
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Contract_Service, "get_record", mock)

        try{ await Offer_Bridge.post_sign_bridge(null, null, 'random', null) }
        catch(err){}

        expect(mock.args[0][1]).to.equal('random')
    })

    it("test post_sign_bridge, delegate agreement_db to get_record", async function(){
        const mock = sinon.fake.throws(new Error())
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Contract_Service, "get_record", mock)

        try{ await Offer_Bridge.post_sign_bridge(null, null, null, null) }
        catch(err){}

        expect(mock.args[0][2] instanceof Agreement).to.equal(true)
    })

    it("test post_sign_bridge, delegate message to signMessage", async function(){
        const mock = sinon.fake()
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({cid: '42345234'}))
        sinon.replace(ethers.Wallet.prototype, "signMessage", mock)

        await Offer_Bridge.post_sign_bridge(null, '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d',
         null, null)

        expect(mock.args[0][0]).to.equal('https://fyp22041.infura-ipfs.io/ipfs/42345234')
    })

    it("test post_sign_bridge, return signature", async function(){
        const mock = sinon.fake.returns("hi")
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({cid: '42345234'}))
        sinon.replace(ethers.Wallet.prototype, "signMessage", mock)

        const response = await Offer_Bridge.post_sign_bridge(null, '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d',
         null, null)

        expect(response).to.eql({signature: "hi"})
    })

    it("test put_sign_bridge, delegate offer_id and signature to mandatory_field_checking", async function(){
        const mock = sinon.fake()
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", mock)
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({}))

        try{ await Offer_Bridge.put_sign_bridge('random id', null, null, 'random sig', null, null, null) }
        catch(err){}

        expect(mock.args[0][0]).to.eql({id: 'random id', signature: 'random sig'})
    })

    it("test put_sign_bridge, delegate offer_id to get_record", async function(){
        const mock = sinon.fake.returns({})
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Contract_Service, "get_record", mock)

        try{ await Offer_Bridge.put_sign_bridge('random id', null, null, null, null, null, null) }
        catch(err){}

        expect(mock.args[0][0]).to.equal('random id')
    })

    it("test put_sign_bridge, delegate user_email to get_record", async function(){
        const mock = sinon.fake.returns({})
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Contract_Service, "get_record", mock)

        try{ await Offer_Bridge.put_sign_bridge(null, null, 'dummy', null, null, null, null) }
        catch(err){}

        expect(mock.args[0][1]).to.equal('dummy')
    })

    it("test put_sign_bridge, delegate agreement_db to get_record", async function(){
        const mock = sinon.fake.returns({})
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Contract_Service, "get_record", mock)

        try{ await Offer_Bridge.put_sign_bridge(null, null, null, null, null, null, null) }
        catch(err){}

        expect(mock.args[0][2] instanceof Agreement).to.equal(true)
    })

    it("test put_sign_bridge, status not REQ_SIGN, throw err status 400", async function(){
        var error
        const mock = sinon.fake.returns({status:""})
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Contract_Service, "get_record", mock)

        try{ await Offer_Bridge.put_sign_bridge(null, null, null, null, null, null, null) }
        catch(err){ error=err }

        expect(error.get_status()).to.equal(400)
    })

    it("test put_sign_bridge, status not REQ_SIGN, throw err message", async function(){
        var error
        const mock = sinon.fake.returns({status:""})
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Contract_Service, "get_record", mock)

        try{ await Offer_Bridge.put_sign_bridge(null, null, null, null, null, null, null) }
        catch(err){ error=err }

        expect(error.get_payload()).to.eql({message: "Only for offer with REQ_SIGN status"})
    })

    it("test put_sign_bridge, INDIVIDUAL account, signed before, throw err status 400", async function(){
        var error
        const mock = sinon.fake.returns({status:"REQ_SIGN", candidate_sig:"fsdf"})
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Contract_Service, "get_record", mock)

        try{ await Offer_Bridge.put_sign_bridge(null, 'INDIVIDUAL', null, null, null, null, null) }
        catch(err){ error=err }

        expect(error.get_status()).to.equal(400)
    })

    it("test put_sign_bridge, INDIVIDUAL account, signed before, throw err message", async function(){
        var error
        const mock = sinon.fake.returns({status:"REQ_SIGN", candidate_sig:"fsdf"})
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Contract_Service, "get_record", mock)

        try{ await Offer_Bridge.put_sign_bridge(null, 'INDIVIDUAL', null, null, null, null, null) }
        catch(err){ error=err }

        expect(error.get_payload()).to.eql({message: "Signed already"})
    })

    it("test put_sign_bridge, BUSINESS account, signed before, throw err status 400", async function(){
        var error
        const mock = sinon.fake.returns({status:"REQ_SIGN", company_sig:"fsdf"})
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Contract_Service, "get_record", mock)

        try{ await Offer_Bridge.put_sign_bridge(null, 'BUSINESS', null, null, null, null, null) }
        catch(err){ error=err }

        expect(error.get_status()).to.equal(400)
    })

    it("test put_sign_bridge, BUSINESS account, signed before, throw err message", async function(){
        var error
        const mock = sinon.fake.returns({status:"REQ_SIGN", company_sig:"fsdf"})
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Contract_Service, "get_record", mock)

        try{ await Offer_Bridge.put_sign_bridge(null, 'BUSINESS', null, null, null, null, null) }
        catch(err){ error=err }

        expect(error.get_payload()).to.eql({message: "Signed already"})
    })

    it("test put_sign_bridge, delegate user_address to verify_sig", async function(){
        const mock = sinon.fake.returns(false)
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({status:"REQ_SIGN", company_sig:null}))
        sinon.replace(Contract_Service, "verify_sig", mock)

        try{ await Offer_Bridge.put_sign_bridge(null, 'BUSINESS', null, null, 'address', null, null) }
        catch(err){}

        expect(mock.args[0][0]).to.equal('address')
    })

    it("test put_sign_bridge, delegate message to verify_sig", async function(){
        const mock = sinon.fake.returns(false)
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({status:"REQ_SIGN", company_sig:null, cid:"1234"}))
        sinon.replace(Contract_Service, "verify_sig", mock)

        try{ await Offer_Bridge.put_sign_bridge(null, 'BUSINESS', null, null, null, null, null) }
        catch(err){}

        expect(mock.args[0][1]).to.equal('https://fyp22041.infura-ipfs.io/ipfs/1234')
    })

    it("test put_sign_bridge, delegate signature to verify_sig", async function(){
        const mock = sinon.fake.returns(false)
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({status:"REQ_SIGN", company_sig:null, cid:"1234"}))
        sinon.replace(Contract_Service, "verify_sig", mock)

        try{ await Offer_Bridge.put_sign_bridge(null, 'BUSINESS', null, 'randomp sign', null, null, null) }
        catch(err){}

        expect(mock.args[0][2]).to.equal('randomp sign')
    })

    it("test put_sign_bridge, invalid signature, throw err status 400", async function(){
        var error
        const mock = sinon.fake.returns(false)
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({status:"REQ_SIGN", company_sig:null, cid:"1234"}))
        sinon.replace(Contract_Service, "verify_sig", mock)

        try{ await Offer_Bridge.put_sign_bridge(null, 'BUSINESS', null, null, null, null, null) }
        catch(err){ error=err }

        expect(error.get_status()).to.equal(400)
    })

    it("test put_sign_bridge, invalid signature, throw err message", async function(){
        var error
        const mock = sinon.fake.returns(false)
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({status:"REQ_SIGN", company_sig:null, cid:"1234"}))
        sinon.replace(Contract_Service, "verify_sig", mock)

        try{ await Offer_Bridge.put_sign_bridge(null, 'BUSINESS', null, null, null, null, null) }
        catch(err){ error=err }

        expect(error.get_payload()).to.eql({message:"Invalid signature"})
    })

    it("test put_sign_bridge, INDIVIDUAL account, delegate company_email to findOne", async function(){
        const mock = sinon.fake.returns({})
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({status:"REQ_SIGN", candidate_sig:null, cid:"1234", company_email: "random", update:sinon.fake()}))
        sinon.replace(Contract_Service, "verify_sig", sinon.fake.returns(true))
        sinon.replace(Account, "model", {})
        sinon.replace(Account.prototype, "findOne", mock)
        sinon.replace(Email_Service.prototype, "send_alert", sinon.fake())
        sinon.replace(Handler, "agreement_payload_handle", sinon.fake())

        await Offer_Bridge.put_sign_bridge(null, 'INDIVIDUAL', null, null, null, null, null) 

        expect(mock.args[0][0]).to.eql({email: 'random'})
    })

    it("test put_sign_bridge, BUSINESS account, delegate candidate_email to findOne", async function(){
        const mock = sinon.fake.returns({})
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({status:"REQ_SIGN", company_sig:null, cid:"1234", candidate_email: "random", update:sinon.fake()}))
        sinon.replace(Contract_Service, "verify_sig", sinon.fake.returns(true))
        sinon.replace(Account, "model", {})
        sinon.replace(Account.prototype, "findOne", mock)
        sinon.replace(Email_Service.prototype, "send_alert", sinon.fake())
        sinon.replace(Handler, "agreement_payload_handle", sinon.fake())

        await Offer_Bridge.put_sign_bridge(null, 'BUSINESS', null, null, null, null, null) 

        expect(mock.args[0][0]).to.eql({email: 'random'})
    })

    it("test put_sign_bridge, BUSINESS account, candidate signed, delegate message to mint_nft", async function(){
        const mock = sinon.fake.returns("")
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({status:"REQ_SIGN", company_sig:null, candidate_sig:'', cid:"1234", candidate_email: "random", update:sinon.fake()}))
        sinon.replace(Contract_Service, "verify_sig", sinon.fake.returns(true))
        sinon.replace(Account, "model", {})
        sinon.replace(Account.prototype, "findOne", sinon.fake.returns({}))
        sinon.replace(Email_Service.prototype, "send_alert", sinon.fake())
        sinon.replace(Handler, "agreement_payload_handle", sinon.fake())
        sinon.replace(NFT_Service, "mint_nft", mock)

        await Offer_Bridge.put_sign_bridge(null, 'BUSINESS', null, null, null, null, null) 

        expect(mock.args[0][0]).to.equal('https://fyp22041.infura-ipfs.io/ipfs/1234')
    })

    it("test put_sign_bridge, BUSINESS account, candidate signed, delegate business address to mint_nft", async function(){
        const mock = sinon.fake.returns("")
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({status:"REQ_SIGN", company_sig:null, candidate_sig:'', cid:"1234", candidate_email: "random", update:sinon.fake()}))
        sinon.replace(Contract_Service, "verify_sig", sinon.fake.returns(true))
        sinon.replace(Account, "model", {})
        sinon.replace(Account.prototype, "findOne", sinon.fake.returns({chain_address:'rando'}))
        sinon.replace(Email_Service.prototype, "send_alert", sinon.fake())
        sinon.replace(Handler, "agreement_payload_handle", sinon.fake())
        sinon.replace(NFT_Service, "mint_nft", mock)

        await Offer_Bridge.put_sign_bridge(null, 'BUSINESS', null, null, 'sdfsdf', null, null) 

        expect(mock.args[0][1]).to.equal('sdfsdf')
    })

    it("test put_sign_bridge, BUSINESS account, candidate signed, delegate user_address to mint_nft", async function(){
        const mock = sinon.fake.returns("")
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({status:"REQ_SIGN", company_sig:null, candidate_sig:'', cid:"1234", candidate_email: "random", update:sinon.fake()}))
        sinon.replace(Contract_Service, "verify_sig", sinon.fake.returns(true))
        sinon.replace(Account, "model", {})
        sinon.replace(Account.prototype, "findOne", sinon.fake.returns({chain_address:'rando'}))
        sinon.replace(Email_Service.prototype, "send_alert", sinon.fake())
        sinon.replace(Handler, "agreement_payload_handle", sinon.fake())
        sinon.replace(NFT_Service, "mint_nft", mock)

        await Offer_Bridge.put_sign_bridge(null, 'BUSINESS', null, null, 'sdfsdf', null, null) 

        expect(mock.args[0][2]).to.equal('rando')
    })

    it("test put_sign_bridge, BUSINESS account, candidate signed, delegate company signature to mint_nft", async function(){
        const mock = sinon.fake.returns("")
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({status:"REQ_SIGN", company_sig:null, candidate_sig:'hi be frd', cid:"1234", candidate_email: "random", update:sinon.fake()}))
        sinon.replace(Contract_Service, "verify_sig", sinon.fake.returns(true))
        sinon.replace(Account, "model", {})
        sinon.replace(Account.prototype, "findOne", sinon.fake.returns({chain_address:'rando'}))
        sinon.replace(Email_Service.prototype, "send_alert", sinon.fake())
        sinon.replace(Handler, "agreement_payload_handle", sinon.fake())
        sinon.replace(NFT_Service, "mint_nft", mock)

        await Offer_Bridge.put_sign_bridge(null, 'BUSINESS', null, 'sdfswedfwe', null, null, null) 

        expect(mock.args[0][3]).to.equal('sdfswedfwe')
    })

    it("test put_sign_bridge, BUSINESS account, candidate signed, delegate candidate signature to mint_nft", async function(){
        const mock = sinon.fake.returns("")
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({status:"REQ_SIGN", company_sig:null, candidate_sig:'sdfsdfewrfwer23', cid:"1234", candidate_email: "random", update:sinon.fake()}))
        sinon.replace(Contract_Service, "verify_sig", sinon.fake.returns(true))
        sinon.replace(Account, "model", {})
        sinon.replace(Account.prototype, "findOne", sinon.fake.returns({chain_address:'rando'}))
        sinon.replace(Email_Service.prototype, "send_alert", sinon.fake())
        sinon.replace(Handler, "agreement_payload_handle", sinon.fake())
        sinon.replace(NFT_Service, "mint_nft", mock)

        await Offer_Bridge.put_sign_bridge(null, 'BUSINESS', null, 'my sig', null, null, null) 

        expect(mock.args[0][4]).to.equal('sdfsdfewrfwer23')
    })

    it("test put_sign_bridge, BUSINESS account, delegate signature to update", async function(){
        const mock = sinon.fake.returns("")
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({status:"REQ_SIGN", company_sig:null, candidate_sig:null,cid:"1234", candidate_email: "random", update:mock}))
        sinon.replace(Contract_Service, "verify_sig", sinon.fake.returns(true))
        sinon.replace(Account, "model", {})
        sinon.replace(Account.prototype, "findOne", sinon.fake.returns({chain_address:'rando'}))
        sinon.replace(Email_Service.prototype, "send_alert", sinon.fake())
        sinon.replace(Handler, "agreement_payload_handle", sinon.fake())
        sinon.replace(NFT_Service, "mint_nft", sinon.fake.returns(""))

        await Offer_Bridge.put_sign_bridge(null, 'BUSINESS', null, 'my sig', null, null, null) 

        expect(mock.args[0][0]).to.eql({company_sig: 'my sig'})
    })

    it("test put_sign_bridge, INDIVIDUAL account company signed, delegate signature, token_id,status to update", async function(){
        const mock = sinon.fake.returns("")
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({status:"REQ_SIGN", company_sig:'', candidate_sig:null,cid:"1234", candidate_email: "random", update:mock}))
        sinon.replace(Contract_Service, "verify_sig", sinon.fake.returns(true))
        sinon.replace(Account, "model", {})
        sinon.replace(Account.prototype, "findOne", sinon.fake.returns({chain_address:'rando'}))
        sinon.replace(Email_Service.prototype, "send_alert", sinon.fake())
        sinon.replace(Handler, "agreement_payload_handle", sinon.fake())
        sinon.replace(NFT_Service, "mint_nft", sinon.fake.returns("1234"))

        await Offer_Bridge.put_sign_bridge(null, 'INDIVIDUAL', null, 'my sig', null, null, null) 

        expect(mock.args[0][0]).to.eql({candidate_sig: 'my sig', token_id: '1234', status: 'COMPLETED'})
    })

    it("test put_sign_bridge, delegate ops_record.email to send_alert", async function(){
        const mock = sinon.fake()
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({status:"REQ_SIGN", company_sig:'', candidate_sig:null,cid:"1234", candidate_email: "random", update:sinon.fake.returns("")}))
        sinon.replace(Contract_Service, "verify_sig", sinon.fake.returns(true))
        sinon.replace(Account, "model", {})
        sinon.replace(Account.prototype, "findOne", sinon.fake.returns({email:'hi'}))
        sinon.replace(Email_Service.prototype, "send_alert", mock)
        sinon.replace(Handler, "agreement_payload_handle", sinon.fake())
        sinon.replace(NFT_Service, "mint_nft", sinon.fake.returns(""))

        await Offer_Bridge.put_sign_bridge(null, 'INDIVIDUAL', null, null, null, null, null) 

        expect(mock.args[0][0]).to.equal('hi')
    })

    it("test put_sign_bridge, delegate ops_record.name to send_alert", async function(){
        const mock = sinon.fake()
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({status:"REQ_SIGN", company_sig:'', candidate_sig:null,cid:"1234", candidate_email: "random", update:sinon.fake.returns("")}))
        sinon.replace(Contract_Service, "verify_sig", sinon.fake.returns(true))
        sinon.replace(Account, "model", {})
        sinon.replace(Account.prototype, "findOne", sinon.fake.returns({name:'hi'}))
        sinon.replace(Email_Service.prototype, "send_alert", mock)
        sinon.replace(Handler, "agreement_payload_handle", sinon.fake())
        sinon.replace(NFT_Service, "mint_nft", sinon.fake.returns(""))

        await Offer_Bridge.put_sign_bridge(null, 'INDIVIDUAL', null, null, null, null, null) 

        expect(mock.args[0][1]).to.equal('hi')
    })

    it("test put_sign_bridge, delegate user_name to send_alert", async function(){
        const mock = sinon.fake()
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({status:"REQ_SIGN", company_sig:'', candidate_sig:null,cid:"1234", candidate_email: "random", update:sinon.fake.returns("")}))
        sinon.replace(Contract_Service, "verify_sig", sinon.fake.returns(true))
        sinon.replace(Account, "model", {})
        sinon.replace(Account.prototype, "findOne", sinon.fake.returns({name:'hi'}))
        sinon.replace(Email_Service.prototype, "send_alert", mock)
        sinon.replace(Handler, "agreement_payload_handle", sinon.fake())
        sinon.replace(NFT_Service, "mint_nft", sinon.fake.returns(""))

        await Offer_Bridge.put_sign_bridge(null, 'INDIVIDUAL', null, null, null, 'sdfsdf', null) 

        expect(mock.args[0][2]).to.equal('sdfsdf')
    })

    it("test put_sign_bridge, delegate offer_id to send_alert", async function(){
        const mock = sinon.fake()
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({status:"REQ_SIGN", company_sig:'', candidate_sig:null,cid:"1234", candidate_email: "random", update:sinon.fake.returns("")}))
        sinon.replace(Contract_Service, "verify_sig", sinon.fake.returns(true))
        sinon.replace(Account, "model", {})
        sinon.replace(Account.prototype, "findOne", sinon.fake.returns({name:'hi'}))
        sinon.replace(Email_Service.prototype, "send_alert", mock)
        sinon.replace(Handler, "agreement_payload_handle", sinon.fake())
        sinon.replace(NFT_Service, "mint_nft", sinon.fake.returns(""))

        await Offer_Bridge.put_sign_bridge('sdfsdf', 'INDIVIDUAL', null, null, null, null, null) 

        expect(mock.args[0][3]).to.equal('sdfsdf')
    })

    it("test put_sign_bridge, opposite didnt sign, delegate REQ_SIGN to send_alert", async function(){
        const mock = sinon.fake()
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({status:"REQ_SIGN", company_sig:null, candidate_sig:null,cid:"1234", candidate_email: "random", update:sinon.fake.returns("")}))
        sinon.replace(Contract_Service, "verify_sig", sinon.fake.returns(true))
        sinon.replace(Account, "model", {})
        sinon.replace(Account.prototype, "findOne", sinon.fake.returns({name:'hi'}))
        sinon.replace(Email_Service.prototype, "send_alert", mock)
        sinon.replace(Handler, "agreement_payload_handle", sinon.fake())
        sinon.replace(NFT_Service, "mint_nft", sinon.fake.returns(""))

        await Offer_Bridge.put_sign_bridge('sdfsdf', 'INDIVIDUAL', null, null, null, null, null) 

        expect(mock.args[0][4]).to.equal('REQ_SIGN')
    })

    it("test put_sign_bridge, opposite signed, delegate REQ_SIGN to send_alert", async function(){
        const mock = sinon.fake()
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({status:"REQ_SIGN", company_sig:null, candidate_sig:'',cid:"1234", candidate_email: "random", update:sinon.fake.returns("")}))
        sinon.replace(Contract_Service, "verify_sig", sinon.fake.returns(true))
        sinon.replace(Account, "model", {})
        sinon.replace(Account.prototype, "findOne", sinon.fake.returns({name:'hi'}))
        sinon.replace(Email_Service.prototype, "send_alert", mock)
        sinon.replace(Handler, "agreement_payload_handle", sinon.fake())
        sinon.replace(NFT_Service, "mint_nft", sinon.fake.returns(""))

        await Offer_Bridge.put_sign_bridge('sdfsdf', 'BUSINESS', null, null, null, null, null) 

        expect(mock.args[0][4]).to.equal('COMPLETED')
    })

    it("test put_sign_bridge, opposite didnt sign, delegate extra_msg to send_alert", async function(){
        const mock = sinon.fake()
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({status:"REQ_SIGN", company_sig:null, candidate_sig:null,cid:"1234", candidate_email: "random", update:sinon.fake.returns("")}))
        sinon.replace(Contract_Service, "verify_sig", sinon.fake.returns(true))
        sinon.replace(Account, "model", {})
        sinon.replace(Account.prototype, "findOne", sinon.fake.returns({name:'hi'}))
        sinon.replace(Email_Service.prototype, "send_alert", mock)
        sinon.replace(Handler, "agreement_payload_handle", sinon.fake())
        sinon.replace(NFT_Service, "mint_nft", sinon.fake.returns(""))

        await Offer_Bridge.put_sign_bridge('sdfsdf', 'INDIVIDUAL', null, null, null, null, null) 

        expect(mock.args[0][5]).to.equal('Please sign the contract. ')
    })

    it("test put_sign_bridge, opposite signed, delegate extra_msg to send_alert", async function(){
        const mock = sinon.fake()
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({status:"REQ_SIGN", company_sig:null, candidate_sig:'',cid:"1234", candidate_email: "random", update:sinon.fake.returns("")}))
        sinon.replace(Contract_Service, "verify_sig", sinon.fake.returns(true))
        sinon.replace(Account, "model", {})
        sinon.replace(Account.prototype, "findOne", sinon.fake.returns({name:'hi'}))
        sinon.replace(Email_Service.prototype, "send_alert", mock)
        sinon.replace(Handler, "agreement_payload_handle", sinon.fake())
        sinon.replace(NFT_Service, "mint_nft", sinon.fake.returns(""))

        await Offer_Bridge.put_sign_bridge('sdfsdf', 'BUSINESS', null, null, null, null, null) 

        expect(mock.args[0][5]).to.equal('NFT is minted with id:<b></b> on contract(address: <b>0xE562669590E6C9e4dab295208EBDb74935e194A2</b>)')
    })

    it("test put_sign_bridge, delegate new_record to agreement_payload_handle", async function(){
        const mock = sinon.fake()
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({status:"REQ_SIGN", company_sig:null, candidate_sig:'',cid:"1234", candidate_email: "random", update:sinon.fake.returns("sdfsdf")}))
        sinon.replace(Contract_Service, "verify_sig", sinon.fake.returns(true))
        sinon.replace(Account, "model", {})
        sinon.replace(Account.prototype, "findOne", sinon.fake.returns({name:'hi'}))
        sinon.replace(Email_Service.prototype, "send_alert", sinon.fake())
        sinon.replace(Handler, "agreement_payload_handle", mock)
        sinon.replace(NFT_Service, "mint_nft", sinon.fake.returns(""))

        await Offer_Bridge.put_sign_bridge(null, 'BUSINESS', null, null, null, null, null) 

        expect(mock.args[0][0]).to.equal('sdfsdf')
    })

    it("test put_sign_bridge, return return value of agreement_payload_handle", async function(){
        const mock = sinon.fake.returns("hohsdhohoo")
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({status:"REQ_SIGN", company_sig:null, candidate_sig:'',cid:"1234", candidate_email: "random", update:sinon.fake.returns("sdfsdf")}))
        sinon.replace(Contract_Service, "verify_sig", sinon.fake.returns(true))
        sinon.replace(Account, "model", {})
        sinon.replace(Account.prototype, "findOne", sinon.fake.returns({name:'hi'}))
        sinon.replace(Email_Service.prototype, "send_alert", sinon.fake())
        sinon.replace(Handler, "agreement_payload_handle", mock)
        sinon.replace(NFT_Service, "mint_nft", sinon.fake.returns(""))

        const response = await Offer_Bridge.put_sign_bridge(null, 'BUSINESS', null, null, null, null, null) 

        expect(response).to.equal('hohsdhohoo')
    })

    it("test put_reject_bridge, delegate offer_id to mandatory_field_checking", async function(){
        const mock = sinon.fake()
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", mock)
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({}))

        try{ await Offer_Bridge.put_reject_bridge('sdfs', null, null, null) }
        catch(err){}

        expect(mock.args[0][0]).to.eql({id: 'sdfs'})
    })

    it("test put_reject_bridge, delegate offer_id to get_record", async function(){
        const mock = sinon.fake.returns({})
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Contract_Service, "get_record", mock)

        try{ await Offer_Bridge.put_reject_bridge('sdfs', null, null, null) }
        catch(err){}

        expect(mock.args[0][0]).to.equal('sdfs')
    })

    it("test put_reject_bridge, delegate user_email to get_record", async function(){
        const mock = sinon.fake.returns({})
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Contract_Service, "get_record", mock)

        try{ await Offer_Bridge.put_reject_bridge(null, 'sdfs', null, null) }
        catch(err){}

        expect(mock.args[0][1]).to.equal('sdfs')
    })

    it("test put_reject_bridge, delegate agreement_db to get_record", async function(){
        const mock = sinon.fake.returns({})
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Contract_Service, "get_record", mock)

        try{ await Offer_Bridge.put_reject_bridge(null, null, null, null) }
        catch(err){}

        expect(mock.args[0][2] instanceof Agreement).to.equal(true)
    })

    it("test put_reject_bridge, status not REQ_REVIEW, throw error with status 400", async function(){
        var error
        const mock = sinon.fake.returns({})
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({}))

        try{ await Offer_Bridge.put_reject_bridge(null, null, null, null) }
        catch(err){ error=err }

        expect(error.get_status()).to.equal(400)
    })

    it("test put_reject_bridge, status not REQ_REVIEW, throw error with message", async function(){
        var error
        const mock = sinon.fake.returns({})
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({}))

        try{ await Offer_Bridge.put_reject_bridge(null, null, null, null) }
        catch(err){ error=err }

        expect(error.get_payload()).to.eql({message: "Action not available"})
    })
    
    it("test put_reject_bridge, status match, delegate query to findOne", async function(){
        const mock = sinon.fake.returns({})
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({status:"REQ_SIGN", company_email:"sdf", update:sinon.fake()}))
        sinon.replace(Account, "model", {})
        sinon.replace(Account.prototype, "findOne", mock)
        sinon.replace(Email_Service.prototype, "send_alert", sinon.fake())
        sinon.replace(Handler, "agreement_payload_handle", sinon.fake())

        await Offer_Bridge.put_reject_bridge(null, null, null, null)

        expect(mock.args[0][0]).to.eql({email: 'sdf'})
    })
    
    it("test put_reject_bridge, status match, delegate query to update", async function(){
        const mock = sinon.fake()
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({status:"REQ_SIGN", company_email:"", update:mock}))
        sinon.replace(Account, "model", {})
        sinon.replace(Account.prototype, "findOne", sinon.fake.returns({}))
        sinon.replace(Email_Service.prototype, "send_alert", sinon.fake())
        sinon.replace(Handler, "agreement_payload_handle", sinon.fake())

        await Offer_Bridge.put_reject_bridge(null, null, null, null)

        expect(mock.args[0][0]).to.eql({status: 'REJECTED'})
    })
    
    it("test put_reject_bridge, status match, delegate company_record.email to send_alert", async function(){
        const mock = sinon.fake()
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({status:"REQ_SIGN", company_email:"", update:sinon.fake()}))
        sinon.replace(Account, "model", {})
        sinon.replace(Account.prototype, "findOne", sinon.fake.returns({email:"sdfsd"}))
        sinon.replace(Email_Service.prototype, "send_alert", mock)
        sinon.replace(Handler, "agreement_payload_handle", sinon.fake())

        await Offer_Bridge.put_reject_bridge(null, null, null, null)

        expect(mock.args[0][0]).to.equal('sdfsd')
    })
    
    it("test put_reject_bridge, status match, delegate company_record.name to send_alert", async function(){
        const mock = sinon.fake()
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({status:"REQ_SIGN", company_email:"", update:sinon.fake()}))
        sinon.replace(Account, "model", {})
        sinon.replace(Account.prototype, "findOne", sinon.fake.returns({name:"sdfsd"}))
        sinon.replace(Email_Service.prototype, "send_alert", mock)
        sinon.replace(Handler, "agreement_payload_handle", sinon.fake())

        await Offer_Bridge.put_reject_bridge(null, null, null, null)

        expect(mock.args[0][1]).to.equal('sdfsd')
    })
    
    it("test put_reject_bridge, status match, delegate user_name to send_alert", async function(){
        const mock = sinon.fake()
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({status:"REQ_SIGN", company_email:"", update:sinon.fake()}))
        sinon.replace(Account, "model", {})
        sinon.replace(Account.prototype, "findOne", sinon.fake.returns({}))
        sinon.replace(Email_Service.prototype, "send_alert", mock)
        sinon.replace(Handler, "agreement_payload_handle", sinon.fake())

        await Offer_Bridge.put_reject_bridge(null, null, 'sdfs', null)

        expect(mock.args[0][2]).to.equal('sdfs')
    })
    
    it("test put_reject_bridge, status match, delegate offer_id to send_alert", async function(){
        const mock = sinon.fake()
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({status:"REQ_SIGN", company_email:"", update:sinon.fake()}))
        sinon.replace(Account, "model", {})
        sinon.replace(Account.prototype, "findOne", sinon.fake.returns({}))
        sinon.replace(Email_Service.prototype, "send_alert", mock)
        sinon.replace(Handler, "agreement_payload_handle", sinon.fake())

        await Offer_Bridge.put_reject_bridge('sdfs', null, null, null)

        expect(mock.args[0][3]).to.equal('sdfs')
    })
    
    it("test put_reject_bridge, status match, delegate REJECTED to send_alert", async function(){
        const mock = sinon.fake()
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({status:"REQ_SIGN", company_email:"", update:sinon.fake()}))
        sinon.replace(Account, "model", {})
        sinon.replace(Account.prototype, "findOne", sinon.fake.returns({}))
        sinon.replace(Email_Service.prototype, "send_alert", mock)
        sinon.replace(Handler, "agreement_payload_handle", sinon.fake())

        await Offer_Bridge.put_reject_bridge(null, null, null, null)

        expect(mock.args[0][4]).to.equal('REJECTED')
    })
    
    it("test put_reject_bridge, status match, delegate null to send_alert", async function(){
        const mock = sinon.fake()
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({status:"REQ_SIGN", company_email:"", update:sinon.fake()}))
        sinon.replace(Account, "model", {})
        sinon.replace(Account.prototype, "findOne", sinon.fake.returns({}))
        sinon.replace(Email_Service.prototype, "send_alert", mock)
        sinon.replace(Handler, "agreement_payload_handle", sinon.fake())

        await Offer_Bridge.put_reject_bridge(null, null, null, null)

        expect(mock.args[0][5]).to.equal(null)
    })
    
    it("test put_reject_bridge, status match, delegate new_record to agreement_payload_handle", async function(){
        const mock = sinon.fake()
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({status:"REQ_SIGN", company_email:"", update:sinon.fake.returns("sdfsdf")}))
        sinon.replace(Account, "model", {})
        sinon.replace(Account.prototype, "findOne", sinon.fake.returns({}))
        sinon.replace(Email_Service.prototype, "send_alert", sinon.fake())
        sinon.replace(Handler, "agreement_payload_handle", mock)

        await Offer_Bridge.put_reject_bridge(null, null, null, null)

        expect(mock.args[0][0]).to.equal('sdfsdf')
    })
    
    it("test put_reject_bridge, status match, return return value", async function(){
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({status:"REQ_SIGN", company_email:"", update:sinon.fake()}))
        sinon.replace(Account, "model", {})
        sinon.replace(Account.prototype, "findOne", sinon.fake.returns({}))
        sinon.replace(Email_Service.prototype, "send_alert", sinon.fake())
        sinon.replace(Handler, "agreement_payload_handle",  sinon.fake.returns('sdfsdf'))

        const response = await Offer_Bridge.put_reject_bridge(null, null, null, null)

        expect(response).to.equal('sdfsdf')
    })

    //////////////////////////////////////////////////////////////
    it("test put_remove_bridge, delegate offer_id to mandatory_field_checking", async function(){
        const mock = sinon.fake()
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", mock)
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({}))

        try{ await Offer_Bridge.put_remove_bridge('sdfs', null, null, null) }
        catch(err){}

        expect(mock.args[0][0]).to.eql({id: 'sdfs'})
    })

    it("test put_remove_bridge, delegate offer_id to get_record", async function(){
        const mock = sinon.fake.returns({})
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Contract_Service, "get_record", mock)

        try{ await Offer_Bridge.put_remove_bridge('sdfs', null, null, null) }
        catch(err){}

        expect(mock.args[0][0]).to.equal('sdfs')
    })

    it("test put_remove_bridge, delegate user_email to get_record", async function(){
        const mock = sinon.fake.returns({})
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Contract_Service, "get_record", mock)

        try{ await Offer_Bridge.put_remove_bridge(null, 'sdfs', null, null) }
        catch(err){}

        expect(mock.args[0][1]).to.equal('sdfs')
    })

    it("test put_remove_bridge, delegate agreement_db to get_record", async function(){
        const mock = sinon.fake.returns({})
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Contract_Service, "get_record", mock)

        try{ await Offer_Bridge.put_remove_bridge(null, null, null, null) }
        catch(err){}

        expect(mock.args[0][2] instanceof Agreement).to.equal(true)
    })

    it("test put_remove_bridge, status not REQ_REVIEW, throw error with status 400", async function(){
        var error
        const mock = sinon.fake.returns({})
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({}))

        try{ await Offer_Bridge.put_remove_bridge(null, null, null, null) }
        catch(err){ error=err }

        expect(error.get_status()).to.equal(400)
    })

    it("test put_remove_bridge, status not REQ_REVIEW, throw error with message", async function(){
        var error
        const mock = sinon.fake.returns({})
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({}))

        try{ await Offer_Bridge.put_remove_bridge(null, null, null, null) }
        catch(err){ error=err }

        expect(error.get_payload()).to.eql({message: "Action not available"})
    })
    
    it("test put_remove_bridge, status match, delegate query to findOne", async function(){
        const mock = sinon.fake.returns({})
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({status:"REQ_SIGN", candidate_email:"sdf", update:sinon.fake()}))
        sinon.replace(Account, "model", {})
        sinon.replace(Account.prototype, "findOne", mock)
        sinon.replace(Email_Service.prototype, "send_alert", sinon.fake())
        sinon.replace(Handler, "agreement_payload_handle", sinon.fake())

        await Offer_Bridge.put_remove_bridge(null, null, null, null)

        expect(mock.args[0][0]).to.eql({email: 'sdf'})
    })
    
    it("test put_remove_bridge, status match, delegate query to update", async function(){
        const mock = sinon.fake()
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({status:"REQ_SIGN", candidate_email:"", update:mock}))
        sinon.replace(Account, "model", {})
        sinon.replace(Account.prototype, "findOne", sinon.fake.returns({}))
        sinon.replace(Email_Service.prototype, "send_alert", sinon.fake())
        sinon.replace(Handler, "agreement_payload_handle", sinon.fake())

        await Offer_Bridge.put_remove_bridge(null, null, null, null)

        expect(mock.args[0][0]).to.eql({status: 'REMOVED'})
    })
    
    it("test put_remove_bridge, status match, delegate company_record.email to send_alert", async function(){
        const mock = sinon.fake()
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({status:"REQ_SIGN", candidate_email:"", update:sinon.fake()}))
        sinon.replace(Account, "model", {})
        sinon.replace(Account.prototype, "findOne", sinon.fake.returns({email:"sdfsd"}))
        sinon.replace(Email_Service.prototype, "send_alert", mock)
        sinon.replace(Handler, "agreement_payload_handle", sinon.fake())

        await Offer_Bridge.put_remove_bridge(null, null, null, null)

        expect(mock.args[0][0]).to.equal('sdfsd')
    })
    
    it("test put_remove_bridge, status match, delegate company_record.name to send_alert", async function(){
        const mock = sinon.fake()
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({status:"REQ_SIGN", candidate_email:"", update:sinon.fake()}))
        sinon.replace(Account, "model", {})
        sinon.replace(Account.prototype, "findOne", sinon.fake.returns({name:"sdfsd"}))
        sinon.replace(Email_Service.prototype, "send_alert", mock)
        sinon.replace(Handler, "agreement_payload_handle", sinon.fake())

        await Offer_Bridge.put_remove_bridge(null, null, null, null)

        expect(mock.args[0][1]).to.equal('sdfsd')
    })
    
    it("test put_remove_bridge, status match, delegate user_name to send_alert", async function(){
        const mock = sinon.fake()
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({status:"REQ_SIGN", candidate_email:"", update:sinon.fake()}))
        sinon.replace(Account, "model", {})
        sinon.replace(Account.prototype, "findOne", sinon.fake.returns({}))
        sinon.replace(Email_Service.prototype, "send_alert", mock)
        sinon.replace(Handler, "agreement_payload_handle", sinon.fake())

        await Offer_Bridge.put_remove_bridge(null, null, 'sdfs', null)

        expect(mock.args[0][2]).to.equal('sdfs')
    })
    
    it("test put_remove_bridge, status match, delegate offer_id to send_alert", async function(){
        const mock = sinon.fake()
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({status:"REQ_SIGN", candidate_email:"", update:sinon.fake()}))
        sinon.replace(Account, "model", {})
        sinon.replace(Account.prototype, "findOne", sinon.fake.returns({}))
        sinon.replace(Email_Service.prototype, "send_alert", mock)
        sinon.replace(Handler, "agreement_payload_handle", sinon.fake())

        await Offer_Bridge.put_remove_bridge('sdfs', null, null, null)

        expect(mock.args[0][3]).to.equal('sdfs')
    })
    
    it("test put_remove_bridge, status match, delegate REJECTED to send_alert", async function(){
        const mock = sinon.fake()
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({status:"REQ_SIGN", candidate_email:"", update:sinon.fake()}))
        sinon.replace(Account, "model", {})
        sinon.replace(Account.prototype, "findOne", sinon.fake.returns({}))
        sinon.replace(Email_Service.prototype, "send_alert", mock)
        sinon.replace(Handler, "agreement_payload_handle", sinon.fake())

        await Offer_Bridge.put_remove_bridge(null, null, null, null)

        expect(mock.args[0][4]).to.equal('REMOVED')
    })
    
    it("test put_remove_bridge, status match, delegate null to send_alert", async function(){
        const mock = sinon.fake()
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({status:"REQ_SIGN", candidate_email:"", update:sinon.fake()}))
        sinon.replace(Account, "model", {})
        sinon.replace(Account.prototype, "findOne", sinon.fake.returns({}))
        sinon.replace(Email_Service.prototype, "send_alert", mock)
        sinon.replace(Handler, "agreement_payload_handle", sinon.fake())

        await Offer_Bridge.put_remove_bridge(null, null, null, null)

        expect(mock.args[0][5]).to.equal(null)
    })
    
    it("test put_remove_bridge, status match, delegate new_record to agreement_payload_handle", async function(){
        const mock = sinon.fake()
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({status:"REQ_SIGN", candidate_email:"", update:sinon.fake.returns("sdfsdf")}))
        sinon.replace(Account, "model", {})
        sinon.replace(Account.prototype, "findOne", sinon.fake.returns({}))
        sinon.replace(Email_Service.prototype, "send_alert", sinon.fake())
        sinon.replace(Handler, "agreement_payload_handle", mock)

        await Offer_Bridge.put_remove_bridge(null, null, null, null)

        expect(mock.args[0][0]).to.equal('sdfsdf')
    })
    
    it("test put_remove_bridge, status match, return return value", async function(){
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({status:"REQ_SIGN", candidate_email:"", update:sinon.fake()}))
        sinon.replace(Account, "model", {})
        sinon.replace(Account.prototype, "findOne", sinon.fake.returns({}))
        sinon.replace(Email_Service.prototype, "send_alert", sinon.fake())
        sinon.replace(Handler, "agreement_payload_handle",  sinon.fake.returns('sdfsdf'))

        const response = await Offer_Bridge.put_remove_bridge(null, null, null, null)

        expect(response).to.equal('sdfsdf')
    })

    it("test put_terminate_bridge, delegate offer_id and signature to mandatory_field_checking", async function(){
        const mock = sinon.fake()
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", mock)
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({}))

        try{ await Offer_Bridge.put_terminate_bridge('random id', 'random sig', null, null, null, null) }
        catch(err){}

        expect(mock.args[0][0]).to.eql({id: 'random id', signature: 'random sig'})
    })

    it("test put_terminate_bridge, delegate offer_id to get_record", async function(){
        const mock = sinon.fake.returns({})
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Contract_Service, "get_record", mock)

        try{ await Offer_Bridge.put_terminate_bridge('random id', null, null, null, null, null) }
        catch(err){}

        expect(mock.args[0][0]).to.equal('random id')
    })

    it("test put_terminate_bridge, delegate user_email to get_record", async function(){
        const mock = sinon.fake.returns({})
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Contract_Service, "get_record", mock)

        try{ await Offer_Bridge.put_terminate_bridge(null, null, 'dummy', null, null, null) }
        catch(err){}

        expect(mock.args[0][1]).to.equal('dummy')
    })

    it("test put_terminate_bridge, delegate agreement_db to get_record", async function(){
        const mock = sinon.fake.returns({})
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Contract_Service, "get_record", mock)

        try{ await Offer_Bridge.put_terminate_bridge(null, null, null, null, null, null) }
        catch(err){}

        expect(mock.args[0][2] instanceof Agreement).to.equal(true)
    })

    it("test put_terminate_bridge, status not COMPLETED, throw error staus 400", async function(){
        var error
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({status: "sdf"}))

        try{ await Offer_Bridge.put_terminate_bridge(null, null, null, null, null, null) }
        catch(err){ error=err }

        expect(error.get_status()).to.equal(400)
    })

    it("test put_terminate_bridge, status not COMPLETED, throw error message", async function(){
        var error
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({status: "sdf"}))

        try{ await Offer_Bridge.put_terminate_bridge(null, null, null, null, null, null) }
        catch(err){ error=err }

        expect(error.get_payload()).to.eql({message: "Action not available"})
    })

    it("test put_terminate_bridge, delegate token_id to terminate_contract", async function(){
        const mock = sinon.fake()
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({status: "COMPLETED", update: sinon.fake(), token_id: "dfsf"}))
        sinon.replace(NFT_Service, "terminate_contract", mock)
        sinon.replace(Account, "model", {})
        sinon.replace(Account.prototype, "findOne", sinon.fake.returns({}))
        sinon.replace(Email_Service.prototype, "send_alert", sinon.fake())
        sinon.replace(Handler, "agreement_payload_handle", sinon.fake())


        await Offer_Bridge.put_terminate_bridge(null, null, null, null, null, null)
    
        expect(mock.args[0][0]).to.equal("dfsf")
    })

    it("test put_terminate_bridge, delegate signature to terminate_contract", async function(){
        const mock = sinon.fake()
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({status: "COMPLETED", update: sinon.fake()}))
        sinon.replace(NFT_Service, "terminate_contract", mock)
        sinon.replace(Account, "model", {})
        sinon.replace(Account.prototype, "findOne", sinon.fake.returns({}))
        sinon.replace(Email_Service.prototype, "send_alert", sinon.fake())
        sinon.replace(Handler, "agreement_payload_handle", sinon.fake())


        await Offer_Bridge.put_terminate_bridge(null, 'dfsf', null, null, null, null)
    
        expect(mock.args[0][1]).to.equal("dfsf")
    })

    it("test put_terminate_bridge, INDIVIDUAL account, delegate company_email to findOne", async function(){
        const mock = sinon.fake.returns({})
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({status: "COMPLETED", update: sinon.fake(), company_email:"sdfsdf"}))
        sinon.replace(NFT_Service, "terminate_contract", sinon.fake())
        sinon.replace(Account, "model", {})
        sinon.replace(Account.prototype, "findOne", mock)
        sinon.replace(Email_Service.prototype, "send_alert", sinon.fake())
        sinon.replace(Handler, "agreement_payload_handle", sinon.fake())


        await Offer_Bridge.put_terminate_bridge(null, null, null, null, 'INDIVIDUAL', null)
    
        expect(mock.args[0][0]).to.eql({email: "sdfsdf"})
    })

    it("test put_terminate_bridge, BUSINESS account, delegate candidate_email to findOne", async function(){
        const mock = sinon.fake.returns({})
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({status: "COMPLETED", update: sinon.fake(), candidate_email:"sdfsdf"}))
        sinon.replace(NFT_Service, "terminate_contract", sinon.fake())
        sinon.replace(Account, "model", {})
        sinon.replace(Account.prototype, "findOne", mock)
        sinon.replace(Email_Service.prototype, "send_alert", sinon.fake())
        sinon.replace(Handler, "agreement_payload_handle", sinon.fake())


        await Offer_Bridge.put_terminate_bridge(null, null, null, null, "BUSINESS", null)
    
        expect(mock.args[0][0]).to.eql({email: "sdfsdf"})
    })

    it("test put_terminate_bridge, delegate TERMINATED to update", async function(){
        const mock = sinon.fake()
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({status: "COMPLETED", update: mock}))
        sinon.replace(NFT_Service, "terminate_contract", sinon.fake())
        sinon.replace(Account, "model", {})
        sinon.replace(Account.prototype, "findOne", sinon.fake.returns({}))
        sinon.replace(Email_Service.prototype, "send_alert", sinon.fake())
        sinon.replace(Handler, "agreement_payload_handle", sinon.fake())


        await Offer_Bridge.put_terminate_bridge(null, null, null, null, "BUSINESS", null)
    
        expect(mock.args[0][0]).to.eql({status: "TERMINATED"})
    })

    it("test put_terminate_bridge, delegate ops_record.email to send_alert", async function(){
        const mock = sinon.fake()
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({status: "COMPLETED", update: sinon.fake()}))
        sinon.replace(NFT_Service, "terminate_contract", sinon.fake())
        sinon.replace(Account, "model", {})
        sinon.replace(Account.prototype, "findOne", sinon.fake.returns({email:"sdfsd"}))
        sinon.replace(Email_Service.prototype, "send_alert", mock)
        sinon.replace(Handler, "agreement_payload_handle", sinon.fake())

        await Offer_Bridge.put_terminate_bridge(null, null, null, null, "BUSINESS", null)
    
        expect(mock.args[0][0]).to.equal("sdfsd")
    })

    it("test put_terminate_bridge, delegate ops_record.name to send_alert", async function(){
        const mock = sinon.fake()
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({status: "COMPLETED", update: sinon.fake()}))
        sinon.replace(NFT_Service, "terminate_contract", sinon.fake())
        sinon.replace(Account, "model", {})
        sinon.replace(Account.prototype, "findOne", sinon.fake.returns({name:"sdfsdf"}))
        sinon.replace(Email_Service.prototype, "send_alert", mock)
        sinon.replace(Handler, "agreement_payload_handle", sinon.fake())

        await Offer_Bridge.put_terminate_bridge(null, null, null, null, "BUSINESS", null)
    
        expect(mock.args[0][1]).to.equal("sdfsdf")
    })

    it("test put_terminate_bridge, delegate user_name to send_alert", async function(){
        const mock = sinon.fake()
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({status: "COMPLETED", update: sinon.fake()}))
        sinon.replace(NFT_Service, "terminate_contract", sinon.fake())
        sinon.replace(Account, "model", {})
        sinon.replace(Account.prototype, "findOne", sinon.fake.returns({}))
        sinon.replace(Email_Service.prototype, "send_alert", mock)
        sinon.replace(Handler, "agreement_payload_handle", sinon.fake())

        await Offer_Bridge.put_terminate_bridge(null, null, null, 'dfsdf', "BUSINESS", null)
    
        expect(mock.args[0][2]).to.equal("dfsdf")
    })

    it("test put_terminate_bridge, delegate offer_id to send_alert", async function(){
        const mock = sinon.fake()
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({status: "COMPLETED", update: sinon.fake()}))
        sinon.replace(NFT_Service, "terminate_contract", sinon.fake())
        sinon.replace(Account, "model", {})
        sinon.replace(Account.prototype, "findOne", sinon.fake.returns({}))
        sinon.replace(Email_Service.prototype, "send_alert", mock)
        sinon.replace(Handler, "agreement_payload_handle", sinon.fake())

        await Offer_Bridge.put_terminate_bridge('sdfsdf', null, null, null, "BUSINESS", null)
    
        expect(mock.args[0][3]).to.equal("sdfsdf")
    })

    it("test put_terminate_bridge, delegate TERMINATED to send_alert", async function(){
        const mock = sinon.fake()
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({status: "COMPLETED", update: sinon.fake()}))
        sinon.replace(NFT_Service, "terminate_contract", sinon.fake())
        sinon.replace(Account, "model", {})
        sinon.replace(Account.prototype, "findOne", sinon.fake.returns({}))
        sinon.replace(Email_Service.prototype, "send_alert", mock)
        sinon.replace(Handler, "agreement_payload_handle", sinon.fake())

        await Offer_Bridge.put_terminate_bridge(null, null, null, null, "BUSINESS", null)
    
        expect(mock.args[0][4]).to.equal("TERMINATED")
    })

    it("test put_terminate_bridge, delegate extra_msg to send_alert", async function(){
        const mock = sinon.fake()
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({status: "COMPLETED", update: sinon.fake(), token_id:"sdfsdf"}))
        sinon.replace(NFT_Service, "terminate_contract", sinon.fake.returns(1234213543))
        sinon.replace(Account, "model", {})
        sinon.replace(Account.prototype, "findOne", sinon.fake.returns({}))
        sinon.replace(Email_Service.prototype, "send_alert", mock)
        sinon.replace(Handler, "agreement_payload_handle", sinon.fake())

        await Offer_Bridge.put_terminate_bridge(null, null, null, null, "BUSINESS", null)
    
        expect(mock.args[0][5]).to.equal("Terminated time is <b>1234213543</b> for token <b>(token_id: sdfsdf)</b>. Smart Contract address: <b>0xE562669590E6C9e4dab295208EBDb74935e194A2</b>")
    })
    
    it("test put_terminate_bridge, delegate new_record to agreement_payload_handle", async function(){
        const mock = sinon.fake()
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({status: "COMPLETED", update: sinon.fake.returns("sdfsdf")}))
        sinon.replace(NFT_Service, "terminate_contract", sinon.fake())
        sinon.replace(Account, "model", {})
        sinon.replace(Account.prototype, "findOne", sinon.fake.returns({}))
        sinon.replace(Email_Service.prototype, "send_alert", sinon.fake())
        sinon.replace(Handler, "agreement_payload_handle", mock)

        await Offer_Bridge.put_terminate_bridge(null, null, null, null, "BUSINESS", null)
    
        expect(mock.args[0][0]).to.equal("sdfsdf")
    })
    
    it("test put_terminate_bridge, return handler response", async function(){
        const mock = sinon.fake.returns("cwefwe")
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({status: "COMPLETED", update: sinon.fake.returns("sdfsdf")}))
        sinon.replace(NFT_Service, "terminate_contract", sinon.fake())
        sinon.replace(Account, "model", {})
        sinon.replace(Account.prototype, "findOne", sinon.fake.returns({}))
        sinon.replace(Email_Service.prototype, "send_alert", sinon.fake())
        sinon.replace(Handler, "agreement_payload_handle", mock)

        const response = await Offer_Bridge.put_terminate_bridge(null, null, null, null, "BUSINESS", null)
    
        expect(response).to.equal("cwefwe")
    })
    
    it("test post_terminate_bridge, delegate offer_id and signature to mandatory_field_checking", async function(){
        const mock = sinon.fake()
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", mock)
        sinon.replace(Contract_Service, "get_record", sinon.fake.throws(new Error()))

        try{ await Offer_Bridge.post_terminate_bridge('random', 'sig', null, null) }
        catch(err){}

        expect(mock.args[0][0]).to.eql({id: 'random', secret: 'sig'})
    })

    it("test post_terminate_bridge, delegate offer_id to get_record", async function(){
        const mock = sinon.fake.throws(new Error())
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Contract_Service, "get_record", mock)

        try{ await Offer_Bridge.post_terminate_bridge('random', null, null, null) }
        catch(err){}

        expect(mock.args[0][0]).to.equal('random')
    })

    it("test post_terminate_bridge, delegate user_email to get_record", async function(){
        const mock = sinon.fake.throws(new Error())
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Contract_Service, "get_record", mock)

        try{ await Offer_Bridge.post_terminate_bridge(null, null, 'random', null) }
        catch(err){}

        expect(mock.args[0][1]).to.equal('random')
    })

    it("test post_terminate_bridge, delegate agreement_db to get_record", async function(){
        const mock = sinon.fake.throws(new Error())
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Contract_Service, "get_record", mock)

        try{ await Offer_Bridge.post_terminate_bridge(null, null, null, null) }
        catch(err){}

        expect(mock.args[0][2] instanceof Agreement).to.equal(true)
    })

    it("test post_terminate_bridge, delegate message to signMessage", async function(){
        const mock = sinon.fake()
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({token_id: '23423'}))
        sinon.replace(ethers.Wallet.prototype, "signMessage", mock)

        await Offer_Bridge.post_terminate_bridge(null, '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d',
         null, null)

        expect(mock.args[0][0]).to.equal('23423')
    })

    it("test post_terminate_bridge, return signature", async function(){
        const mock = sinon.fake.returns("hi")
        sinon.replace(Agreement, "model", {})
        sinon.replace(Util_Service, "mandatory_field_checking", sinon.fake())
        sinon.replace(Contract_Service, "get_record", sinon.fake.returns({token_id: '23423'}))
        sinon.replace(ethers.Wallet.prototype, "signMessage", mock)

        const response = await Offer_Bridge.post_terminate_bridge(null, '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d',
         null, null)

        expect(response).to.eql({signature: "hi"})
    })
})