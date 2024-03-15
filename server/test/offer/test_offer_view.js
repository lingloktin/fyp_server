const sinon = require("sinon");
const { expect } = require("chai");
const {Offer_View} = require("../../offer/offer_view.js")
const {Offer_Bridge} = require("../../offer/offer_bridge.js")
const {Handler} = require("../../util/handler.js")

const req = (status=null) => {return {  
    user:{
        email: "dummy email",
        type: "dummy type"
    },
    query: {
        status: status
    }
}}

const get_status_req = (id=null) => {return {  
    user:{
        email: "dummy email",
        type: "dummy type"
    },
    query: {
        id: id
    }
}}

const get_offer_req = (id=null) => {return {  
    user:{
        email: "dummy email",
        type: "dummy type"
    },
    params:{
        id: id
    }
}}

const put_accept_req = (id=null) => {return {  
    body:{
        id: id,
    },
    user:{
        name: "dummy name",
        type: "dummy type",
        email: "dummy email",
        id: 'dummy id',
    },
}}

const post_sign_req = (id=null, secret=null) => {return {  
    body:{
        id: id,
        secret: secret
    },
    user:{
        email: "dummy email"
    },
}}

const put_sign_req = (id=null, signature=null) => {return {  
    body:{
        id: id,
        signature: signature
    },
    user:{
        name: "dummy name",
        type: "dummy type",
        email: "dummy email",
        id: 'dummy id',
        chain_address: 'dummy address'
    },
}}



const post_req = 
    (job_title=undefined, candidate_email=undefined, email=undefined, name=undefined, 
        originalname=undefined, buffer=undefined, password=undefined, job_description=undefined, 
        file_type='application/pdf', id=undefined, type=undefined) => {return {
    body: {
        job_title: job_title,
        candidate_email: candidate_email, 
        password: password,
        job_description: job_description,
        id: id
    },
    file:{
        originalname: originalname,
        buffer: buffer,
        mimetype: file_type
    },
    user:{
        email: email, 
        name: name,
        type: type
    }
}}

const res = () => { return{
    status: (code)=> {
        return {
            json: (payload)=>{return {
                status: code,
                json: payload
            }},
            send:(payload)=>{return {
                status: code,
                send: payload
            }}
        }
    },
    set: (header) =>{return this.sdf=header}
}}

describe("Offer_View", function(){
    this.beforeEach(function(){
        sinon.replace(console, "log", sinon.fake())
    })
    this.afterEach(function(){
        sinon.restore();
    })

    it("test post method, invalid file type, throw error with status 400", async function(){
        //test setup
        const mock = sinon.fake.returns(null)
        sinon.replace(Offer_Bridge, "post_bridge", mock)
        
        //target component
        const view = new Offer_View()
        const response = await view.post(post_req(null,null,null, null,null, null, null, null, null), res())

        //assertion
        expect(response.status).to.equal(400);
    })

    it("test post method, invalid file type, throw error with status 400", async function(){
        //test setup
        const mock = sinon.fake.returns(null)
        sinon.replace(Offer_Bridge, "post_bridge", mock)
        
        //target component
        const view = new Offer_View()
        const response = await view.post(post_req(null,null,null, null,null, null, null, null, null), res())

        //assertion
        expect(response.json).to.eql({message:"Invalid file format, please attach contract in pdf format"});
    })

    it("test post method, delegate job_title to post_bridge function", async function(){
        //test setup
        const mock = sinon.fake.returns(null)
        sinon.replace(Offer_Bridge, "post_bridge", mock)
        
        //target component
        const view = new Offer_View()
        await view.post(post_req('dummy'), res())

        //assertion
        expect(mock.args[0][0]).to.equal('dummy');
    })

    it("test post method, delegate candidate_email to post_bridge function", async function(){
        const mock = sinon.fake.returns(null)
        sinon.replace(Offer_Bridge, "post_bridge", mock)
        
        const view = new Offer_View()
        await view.post(post_req(null, "dummy"), res())

        expect(mock.args[0][1]).to.equal('dummy');
    })

    it("test post method, delegate company_email to post_bridge function", async function(){
        const mock = sinon.fake.returns(null)
        sinon.replace(Offer_Bridge, "post_bridge", mock)
        
        const view = new Offer_View()
        await view.post(post_req(null,null, "dummy"), res())

        expect(mock.args[0][2]).to.equal('dummy');
    })

    it("test post method, delegate file_name to post_bridge function", async function(){
        const mock = sinon.fake.returns(null)
        sinon.replace(Offer_Bridge, "post_bridge", mock)
        
        const view = new Offer_View()
        await view.post(post_req(null,null,null, "dummy"), res())

        expect(mock.args[0][3]).to.equal('dummy');
    })

    it("test post method, delegate file_buffer to post_bridge function", async function(){
        const mock = sinon.fake.returns(null)
        sinon.replace(Offer_Bridge, "post_bridge", mock)
        
        const view = new Offer_View()
        await view.post(post_req(null,null,null, null, "dummy"), res())

        expect(mock.args[0][4]).to.equal('dummy');
    })

    it("test post method, delegate password to post_bridge function", async function(){
        const mock = sinon.fake.returns(null)
        sinon.replace(Offer_Bridge, "post_bridge", mock)
        
        const view = new Offer_View()
        await view.post(post_req(null,null,null, null,null, "dummy"), res())

        expect(mock.args[0][5]).to.equal('dummy');
    })

    it("test post method, delegate job_description to post_bridge function", async function(){
        const mock = sinon.fake.returns(null)
        sinon.replace(Offer_Bridge, "post_bridge", mock)
        
        const view = new Offer_View()
        await view.post(post_req(null,null,null, null,null, null, "dummy"), res())

        expect(mock.args[0][6]).to.equal('dummy');
    })

    it("test post method, success, return status 200", async function(){
        const mock = sinon.fake.returns(null)
        sinon.replace(Offer_Bridge, "post_bridge", mock)
        
        const view = new Offer_View()
        const response = await view.post(post_req(), res())

        expect(response.status).to.equal(200);
    })

    it("test post method, success, return payload", async function(){
        const mock = sinon.fake.returns("dummy")
        sinon.replace(Offer_Bridge, "post_bridge", mock)
        
        const view = new Offer_View()
        const response = await view.post(post_req(), res())

        expect(response.json).to.equal("dummy");
    })

    it("test post method, error occured, delegate res to error handler", async function(){
        const mock = sinon.fake.returns(null)
        sinon.replace(Handler, "error_handle", mock)
        sinon.replace(Offer_Bridge, "post_bridge", sinon.fake.throws(new Error()))
        
        const view = new Offer_View()
        const response = await view.post(post_req(), 'dummy')

        expect(mock.args[0][0]).to.eql('dummy');
    })

    it("test post method, error occured, delegate err to error handler", async function(){
        const mock = sinon.fake.returns("dummy")
        sinon.replace(Handler, "error_handle", mock)
        sinon.replace(Offer_Bridge, "post_bridge", sinon.fake.throws(new Error('not an error, just for testing')))
        
        const view = new Offer_View()
        const response = await view.post(post_req(), res())

        expect(mock.args[0][1].message).to.equal("not an error, just for testing");
    })

    it("test post method, error occured, return return value of error handler", async function(){
        const mock = sinon.fake.returns("dummy")
        sinon.replace(Handler, "error_handle", mock)
        sinon.replace(Offer_Bridge, "post_bridge", sinon.fake.throws(new Error()))
        
        const view = new Offer_View()
        const response = await view.post(post_req(), res())

        expect(response).to.equal("dummy");
    })

    it("test get method, req.query.status is string, cast to array ", async function(){
        const mock = sinon.fake()
        sinon.replace(Handler, "error_handle", sinon.fake())
        sinon.replace(Offer_Bridge, "get_bridge", mock)
        
        const view = new Offer_View()
        const response = await view.get(req("sdf"), res())
        console.log(mock.callCount)

        expect(mock.args[0][2]).to.eql(["sdf"]);
    })

    it("test get method, delegate user email to bridge ", async function(){
        const mock = sinon.fake()
        sinon.replace(Handler, "error_handle", sinon.fake())
        sinon.replace(Offer_Bridge, "get_bridge", mock)
        
        const view = new Offer_View()
        const response = await view.get(req(), res())

        expect(mock.args[0][0]).to.equal("dummy email");
    })

    it("test get method, delegate user type to bridge", async function(){
        const mock = sinon.fake()
        sinon.replace(Handler, "error_handle", sinon.fake())
        sinon.replace(Offer_Bridge, "get_bridge", mock)
        
        const view = new Offer_View()
        const response = await view.get(req(), res())

        expect(mock.args[0][1]).to.equal("dummy type");
    })

    it("test get method, delegate query to bridge", async function(){
        const mock = sinon.fake()
        sinon.replace(Handler, "error_handle", sinon.fake())
        sinon.replace(Offer_Bridge, "get_bridge", mock)
        
        const view = new Offer_View()
        const response = await view.get(req(["sdfsdf", "sdfsdfr423"]), res())

        expect(mock.args[0][2]).to.eql(["sdfsdf", "sdfsdfr423"]);
    })

    it("test get method, delegate query to bridge", async function(){
        const mock = sinon.fake()
        sinon.replace(Handler, "error_handle", sinon.fake())
        sinon.replace(Offer_Bridge, "get_bridge", mock)
        
        const view = new Offer_View()
        const response = await view.get(req(["sdfsdf", "sdfsdfr423"]), res())

        expect(mock.args[0][2]).to.eql(["sdfsdf", "sdfsdfr423"]);
    })

    it("test get_contract_view, delegate id to bridge", async function(){
        const mock = sinon.fake()
        sinon.replace(Handler, "error_handle", sinon.fake())
        sinon.replace(Offer_Bridge, "get_contract_bridge", mock)
        
        const view = new Offer_View()
        const response = await view.get_contract_view(get_status_req("dummy"), res())

        expect(mock.args[0][0]).to.eql("dummy");
    })

    it("test get_contract_view, delegate email to bridge", async function(){
        const mock = sinon.fake()
        sinon.replace(Handler, "error_handle", sinon.fake())
        sinon.replace(Offer_Bridge, "get_contract_bridge", mock)
        
        const view = new Offer_View()
        const response = await view.get_contract_view(get_status_req(), res())

        expect(mock.args[0][1]).to.eql("dummy email");
    })

    it("test get_contract_view, delegate sequelizer to bridge", async function(){
        const mock = sinon.fake()
        sinon.replace(Handler, "error_handle", sinon.fake())
        sinon.replace(Offer_Bridge, "get_contract_bridge", mock)
        
        const view = new Offer_View("dummy")
        const response = await view.get_contract_view(get_status_req(), res())

        expect(mock.args[0][2]).to.eql("dummy");
    })

    it("test get_contract_view, return status 200", async function(){
        const mock = sinon.fake()
        sinon.replace(Handler, "error_handle", sinon.fake())
        sinon.replace(Offer_Bridge, "get_contract_bridge", mock)
        
        const view = new Offer_View()
        const response = await view.get_contract_view(get_status_req("dummy"), res())

        expect(response.status).to.equal(200);
    })

    it("test get_contract_view, return payload", async function(){
        const mock = sinon.fake.returns("dummy")
        sinon.replace(Handler, "error_handle", sinon.fake())
        sinon.replace(Offer_Bridge, "get_contract_bridge", mock)
        
        const view = new Offer_View()
        const response = await view.get_contract_view(get_status_req(), res())

        expect(response.send).to.equal("dummy");
    })

    it("test get_contract_view, error occured, delegate res to error handler", async function(){
        const mock = sinon.fake()
        sinon.replace(Handler, "error_handle", mock)
        sinon.replace(Offer_Bridge, "get_contract_bridge", sinon.fake.throws(new Error()))
        
        const view = new Offer_View()
        const response = await view.get_contract_view(get_status_req(), 'dummy')

        expect(mock.args[0][0]).to.eql("dummy");
    })

    it("test get_contract_view, error occured, delegate err to error handler", async function(){
        const mock = sinon.fake.returns("dummy")
        sinon.replace(Handler, "error_handle", mock)
        sinon.replace(Offer_Bridge, "get_contract_bridge", sinon.fake.throws(new Error('not an error, just for testing')))
        
        const view = new Offer_View()
        const response = await view.get_contract_view(get_status_req(), res())

        expect(mock.args[0][1].message).to.equal("not an error, just for testing");
    })

    it("test get_offer_view, delegate id to bridge", async function(){
        const mock = sinon.fake()
        sinon.replace(Handler, "error_handle", sinon.fake())
        sinon.replace(Offer_Bridge, "get_offer_bridge", mock)
        
        const view = new Offer_View()
        const response = await view.get_offer_view(get_offer_req("dummy"), res())

        expect(mock.args[0][0]).to.eql("dummy");
    })

    it("test get_offer_view, delegate email to bridge", async function(){
        const mock = sinon.fake()
        sinon.replace(Handler, "error_handle", sinon.fake())
        sinon.replace(Offer_Bridge, "get_offer_bridge", mock)
        
        const view = new Offer_View()
        const response = await view.get_offer_view(get_offer_req(), res())

        expect(mock.args[0][1]).to.eql("dummy email");
    })

    it("test get_offer_view, delegate user type to bridge", async function(){
        const mock = sinon.fake()
        sinon.replace(Handler, "error_handle", sinon.fake())
        sinon.replace(Offer_Bridge, "get_offer_bridge", mock)
        
        const view = new Offer_View("dummy")
        const response = await view.get_offer_view(get_offer_req(), res())

        expect(mock.args[0][2]).to.eql("dummy type");
    })

    it("test get_offer_view, delegate sequelizer to bridge", async function(){
        const mock = sinon.fake()
        sinon.replace(Handler, "error_handle", sinon.fake())
        sinon.replace(Offer_Bridge, "get_offer_bridge", mock)
        
        const view = new Offer_View("dummy")
        const response = await view.get_offer_view(get_offer_req(), res())

        expect(mock.args[0][3]).to.eql("dummy");
    })

    it("test get_offer_view, return status 200", async function(){
        const mock = sinon.fake()
        sinon.replace(Handler, "error_handle", sinon.fake())
        sinon.replace(Offer_Bridge, "get_offer_bridge", mock)
        
        const view = new Offer_View()
        const response = await view.get_offer_view(get_offer_req("dummy"), res())

        expect(response.status).to.equal(200);
    })

    it("test get_offer_view, return payload", async function(){
        const mock = sinon.fake.returns("dummy")
        sinon.replace(Handler, "error_handle", sinon.fake())
        sinon.replace(Offer_Bridge, "get_offer_bridge", mock)
        
        const view = new Offer_View()
        const response = await view.get_offer_view(get_offer_req(), res())

        expect(response.json).to.equal("dummy");
    })

    it("test get_offer_view, error occured, delegate res to error handler", async function(){
        const mock = sinon.fake()
        sinon.replace(Handler, "error_handle", mock)
        sinon.replace(Offer_Bridge, "get_offer_bridge", sinon.fake.throws(new Error()))
        
        const view = new Offer_View()
        const response = await view.get_offer_view(get_offer_req(), 'dummy')

        expect(mock.args[0][0]).to.eql("dummy");
    })

    it("test get_offer_view, error occured, delegate err to error handler", async function(){
        const mock = sinon.fake.returns("dummy")
        sinon.replace(Handler, "error_handle", mock)
        sinon.replace(Offer_Bridge, "get_offer_bridge", sinon.fake.throws(new Error('not an error, just for testing')))
        
        const view = new Offer_View()
        const response = await view.get_offer_view(get_offer_req(), res())

        expect(mock.args[0][1].message).to.equal("not an error, just for testing");
    })

    it("test put_accept_view, delegate id to bridge", async function(){
        const mock = sinon.fake()
        sinon.replace(Handler, "error_handle", sinon.fake())
        sinon.replace(Offer_Bridge, "put_accept_bridge", mock)
        
        const view = new Offer_View()
        const response = await view.put_accept_view(put_accept_req('randpom'), res())

        expect(mock.args[0][0]).to.eql("randpom");
    })

    it("test put_accept_view, delegate user type to bridge", async function(){
        const mock = sinon.fake()
        sinon.replace(Handler, "error_handle", sinon.fake())
        sinon.replace(Offer_Bridge, "put_accept_bridge", mock)
        
        const view = new Offer_View()
        const response = await view.put_accept_view(put_accept_req(), res())

        expect(mock.args[0][1]).to.eql("dummy type");
    })

    it("test put_accept_view, delegate user.name to bridge", async function(){
        const mock = sinon.fake()
        sinon.replace(Handler, "error_handle", sinon.fake())
        sinon.replace(Offer_Bridge, "put_accept_bridge", mock)
        
        const view = new Offer_View()
        const response = await view.put_accept_view(put_accept_req(), res())

        expect(mock.args[0][2]).to.eql("dummy name");
    })

    it("test put_accept_view, delegate user.email to bridge", async function(){
        const mock = sinon.fake()
        sinon.replace(Handler, "error_handle", sinon.fake())
        sinon.replace(Offer_Bridge, "put_accept_bridge", mock)
        
        const view = new Offer_View()
        const response = await view.put_accept_view(put_accept_req(), res())

        expect(mock.args[0][3]).to.eql("dummy email");
    })

    it("test put_accept_view, delegate user.id to bridge", async function(){
        const mock = sinon.fake()
        sinon.replace(Handler, "error_handle", sinon.fake())
        sinon.replace(Offer_Bridge, "put_accept_bridge", mock)
        
        const view = new Offer_View()
        const response = await view.put_accept_view(put_accept_req(), res())

        expect(mock.args[0][4]).to.eql("dummy id");
    })

    it("test put_accept_view, delegate sequelizer to bridge", async function(){
        const mock = sinon.fake()
        sinon.replace(Handler, "error_handle", sinon.fake())
        sinon.replace(Offer_Bridge, "put_accept_bridge", mock)
        
        const view = new Offer_View("dummy")
        const response = await view.put_accept_view(put_accept_req(), res())

        expect(mock.args[0][5]).to.eql("dummy");
    })

    it("test put_accept_view, return status 200", async function(){
        const mock = sinon.fake()
        sinon.replace(Handler, "error_handle", sinon.fake())
        sinon.replace(Offer_Bridge, "put_accept_bridge", mock)
        
        const view = new Offer_View()
        const response = await view.put_accept_view(put_accept_req("dummy"), res())

        expect(response.status).to.equal(200);
    })

    it("test put_accept_view, return payload", async function(){
        const mock = sinon.fake.returns("dummy")
        sinon.replace(Handler, "error_handle", sinon.fake())
        sinon.replace(Offer_Bridge, "put_accept_bridge", mock)
        
        const view = new Offer_View()
        const response = await view.put_accept_view(put_accept_req(), res())

        expect(response.json).to.equal("dummy");
    })

    it("test put_accept_view, error occured, delegate res to error handler", async function(){
        const mock = sinon.fake()
        sinon.replace(Handler, "error_handle", mock)
        sinon.replace(Offer_Bridge, "put_accept_bridge", sinon.fake.throws(new Error()))
        
        const view = new Offer_View()
        const response = await view.put_accept_view(put_accept_req(), 'dummy')

        expect(mock.args[0][0]).to.eql("dummy");
    })

    it("test put_accept_view, error occured, delegate err to error handler", async function(){
        const mock = sinon.fake.returns("dummy")
        sinon.replace(Handler, "error_handle", mock)
        sinon.replace(Offer_Bridge, "put_accept_bridge", sinon.fake.throws(new Error('not an error, just for testing')))
        
        const view = new Offer_View()
        const response = await view.put_accept_view(put_accept_req(), res())

        expect(mock.args[0][1].message).to.equal("not an error, just for testing");
    })

    it("test put_modify_view, with file & invalid file format, throw err status 400", async function(){
        const mock = sinon.fake()
        sinon.replace(Handler, "error_handle", mock)
        sinon.replace(Offer_Bridge, "put_modify_bridge", sinon.fake())
        
        const view = new Offer_View()
        const response = await view.put_modify_view(post_req(undefined,undefined,undefined,undefined,undefined,'file',undefined,undefined,'random format'), res())

        expect(mock.args[0][1].get_status()).to.equal(400);
    })

    it("test put_modify_view, with file & invalid file format, throw err error message", async function(){
        const mock = sinon.fake()
        sinon.replace(Handler, "error_handle", mock)
        sinon.replace(Offer_Bridge, "put_modify_bridge", sinon.fake())
        
        const view = new Offer_View()
        const response = await view.put_modify_view(post_req(undefined,undefined,undefined,undefined,undefined,'file',undefined,undefined,'random format',undefined,undefined), res())

        expect(mock.args[0][1].get_payload()).to.eql({message:"Invalid file format, please attach contract in pdf format"});
    })

    it("test put_modify_view, with file, delegate offer_id to modify_bridge", async function(){
        const mock = sinon.fake()
        sinon.replace(Handler, "error_handle", sinon.fake())
        sinon.replace(Offer_Bridge, "put_modify_bridge", mock)
        
        const view = new Offer_View()
        const response = await view.put_modify_view(post_req(undefined,undefined, undefined,undefined, undefined, 'file',undefined,undefined,'application/pdf', 'rsadfsdf',undefined), res())

        expect(mock.args[0][0]).to.equal('rsadfsdf');
    })

    it("test put_modify_view, with file, delegate req.user.type to modify_bridge", async function(){
        const mock = sinon.fake()
        sinon.replace(Handler, "error_handle", sinon.fake())
        sinon.replace(Offer_Bridge, "put_modify_bridge", mock)
        
        const view = new Offer_View()
        const response = await view.put_modify_view(post_req(undefined,undefined, undefined,undefined,undefined,'file',undefined,undefined, 'application/pdf', undefined,'rsadfsdf'), res())

        expect(mock.args[0][1]).to.equal('rsadfsdf');
    })

    it("test put_modify_view, with file, delegate req.user.email to modify_bridge", async function(){
        const mock = sinon.fake()
        sinon.replace(Handler, "error_handle", sinon.fake())
        sinon.replace(Offer_Bridge, "put_modify_bridge", mock)
        
        const view = new Offer_View()
        const response = await view.put_modify_view(post_req(undefined,undefined, 'rsadfsdf',undefined,undefined,'file',undefined,undefined, 'application/pdf', undefined,'rsadfsdf'), res())

        expect(mock.args[0][2]).to.equal('rsadfsdf');
    })

    it("test put_modify_view, with file, delegate req.user.name to modify_bridge", async function(){
        const mock = sinon.fake()
        sinon.replace(Handler, "error_handle", sinon.fake())
        sinon.replace(Offer_Bridge, "put_modify_bridge", mock)
        
        const view = new Offer_View()
        const response = await view.put_modify_view(post_req(undefined,undefined, undefined,'rsadfsdf',undefined,'file',undefined,undefined, 'application/pdf', undefined,'rsadfsdf'), res())

        expect(mock.args[0][3]).to.equal('rsadfsdf');
    })

    it("test put_modify_view, with file, delegate req.file.buffer to modify_bridge", async function(){
        const mock = sinon.fake()
        sinon.replace(Handler, "error_handle", sinon.fake())
        sinon.replace(Offer_Bridge, "put_modify_bridge", mock)
        
        const view = new Offer_View()
        const response = await view.put_modify_view(post_req(undefined,undefined, undefined,undefined,undefined,'file',undefined,undefined, 'application/pdf', undefined,'rsadfsdf'), res())

        expect(mock.args[0][4]).to.equal('file');
    })

    it("test put_modify_view, with file, delegate req.body.job_title to modify_bridge", async function(){
        const mock = sinon.fake()
        sinon.replace(Handler, "error_handle", sinon.fake())
        sinon.replace(Offer_Bridge, "put_modify_bridge", mock)
        
        const view = new Offer_View()
        const response = await view.put_modify_view(post_req('random',undefined, undefined,undefined,undefined,'file',undefined,undefined, 'application/pdf', undefined,'rsadfsdf'), res())

        expect(mock.args[0][5]).to.equal('random');
    })

    it("test put_modify_view, with file, delegate req.body.job_description to modify_bridge", async function(){
        const mock = sinon.fake()
        sinon.replace(Handler, "error_handle", sinon.fake())
        sinon.replace(Offer_Bridge, "put_modify_bridge", mock)
        
        const view = new Offer_View()
        const response = await view.put_modify_view(post_req(undefined,undefined, undefined,undefined,undefined,'file',undefined,'random', 'application/pdf', undefined,'rsadfsdf'), res())

        expect(mock.args[0][6]).to.equal('random');
    })

    it("test put_modify_view, with file, delegate req.body.password to modify_bridge", async function(){
        const mock = sinon.fake()
        sinon.replace(Handler, "error_handle", sinon.fake())
        sinon.replace(Offer_Bridge, "put_modify_bridge", mock)
        
        const view = new Offer_View()
        const response = await view.put_modify_view(post_req(undefined,undefined, undefined,undefined,undefined,'file','pw', undefined, 'application/pdf', undefined,'rsadfsdf'), res())

        expect(mock.args[0][7]).to.equal('pw');
    })

    it("test put_modify_view, with file, delegate sequelize to modify_bridge", async function(){
        const mock = sinon.fake()
        sinon.replace(Handler, "error_handle", sinon.fake())
        sinon.replace(Offer_Bridge, "put_modify_bridge", mock)
        
        const view = new Offer_View('sdfsdf')
        const response = await view.put_modify_view(post_req(undefined,undefined, undefined,undefined,undefined,'file', undefined, undefined, 'application/pdf', undefined,'rsadfsdf'), res())

        expect(mock.args[0][8]).to.equal('sdfsdf');
    })

    it("test put_modify_view, success, return status 200", async function(){
        const mock = sinon.fake()
        sinon.replace(Handler, "error_handle", sinon.fake())
        sinon.replace(Offer_Bridge, "put_modify_bridge", mock)
        
        const view = new Offer_View()
        const response = await view.put_modify_view(post_req(undefined,undefined, undefined,undefined,undefined,'file', undefined, undefined, 'application/pdf', undefined,'rsadfsdf'), res())

        expect(response.status).to.equal(200);
    })

    it("test put_modify_view, success, return with payload", async function(){
        const mock = sinon.fake.returns("hi")
        sinon.replace(Handler, "error_handle", sinon.fake())
        sinon.replace(Offer_Bridge, "put_modify_bridge", mock)
        
        const view = new Offer_View()
        const response = await view.put_modify_view(post_req(undefined,undefined, undefined,undefined,undefined,'file', undefined, undefined, 'application/pdf', undefined,'rsadfsdf'), res())

        expect(response.json).to.equal('hi');
    })

    it("test put_modify_view, with error, delegate res to error handler", async function(){
        const mock = sinon.fake()
        sinon.replace(Handler, "error_handle", mock)
        sinon.replace(Offer_Bridge, "put_modify_bridge", sinon.fake.throws(new Error()))
        
        const view = new Offer_View()
        const response = await view.put_modify_view(post_req(undefined,undefined, undefined,undefined,undefined,'file', undefined, undefined, 'application/pdf', undefined,'rsadfsdf'), 'sdfdsf')

        expect(mock.args[0][0]).to.equal('sdfdsf');
    })

    it("test put_modify_view, with error, delegate err to error handler", async function(){
        const mock = sinon.fake()
        sinon.replace(Handler, "error_handle", mock)
        sinon.replace(Offer_Bridge, "put_modify_bridge", sinon.fake.throws(new Error('not an error, just for testing')))
        
        const view = new Offer_View()
        const response = await view.put_modify_view(post_req(undefined,undefined, undefined,undefined,undefined,'file', undefined, undefined, 'application/pdf', undefined,'rsadfsdf'), res())

        expect(mock.args[0][1].message).to.equal('not an error, just for testing');
    })

    it("test put_modify_view, with error, return return value of handler", async function(){
        sinon.replace(Handler, "error_handle", sinon.fake.returns("hasflksjdflks"))
        sinon.replace(Offer_Bridge, "put_modify_bridge", sinon.fake.throws(new Error('not an error, just for testing')))
        
        const view = new Offer_View()
        const response = await view.put_modify_view(post_req(undefined,undefined, undefined,undefined,undefined,'file', undefined, undefined, 'application/pdf', undefined,'rsadfsdf'), res())

        expect(response).to.equal('hasflksjdflks');
    })

    it("test post_sign_view, delegate offer_id to post_sign_bridge", async function(){
        const mock = sinon.fake()
        sinon.replace(Handler, "error_handle", sinon.fake())
        sinon.replace(Offer_Bridge, "post_sign_bridge", mock)
        
        const view = new Offer_View()
        const response = await view.post_sign_view(post_sign_req('dummy'), res())

        expect(mock.args[0][0]).to.equal('dummy');
    })

    it("test post_sign_view, delegate secret to post_sign_bridge", async function(){
        const mock = sinon.fake()
        sinon.replace(Handler, "error_handle", sinon.fake())
        sinon.replace(Offer_Bridge, "post_sign_bridge", mock)
        
        const view = new Offer_View()
        const response = await view.post_sign_view(post_sign_req('dummy', 'sdflsdkjf'), res())

        expect(mock.args[0][1]).to.equal('sdflsdkjf');
    })

    it("test post_sign_view, delegate secret to post_sign_bridge", async function(){
        const mock = sinon.fake()
        sinon.replace(Handler, "error_handle", sinon.fake())
        sinon.replace(Offer_Bridge, "post_sign_bridge", mock)
        
        const view = new Offer_View()
        const response = await view.post_sign_view(post_sign_req(null, null), res())

        expect(mock.args[0][2]).to.equal('dummy email');
    })

    it("test post_sign_view, delegate sequelize to post_sign_bridge", async function(){
        const mock = sinon.fake()
        sinon.replace(Handler, "error_handle", sinon.fake())
        sinon.replace(Offer_Bridge, "post_sign_bridge", mock)
        
        const view = new Offer_View('sdfsd')
        const response = await view.post_sign_view(post_sign_req(null, null), res())

        expect(mock.args[0][3]).to.equal('sdfsd');
    })
        
        
    it("test post_sign_view, return status 200", async function(){
        const mock = sinon.fake()
        sinon.replace(Handler, "error_handle", sinon.fake())
        sinon.replace(Offer_Bridge, "post_sign_bridge", mock)
        
        const view = new Offer_View()
        const response = await view.post_sign_view(post_sign_req(null, null), res())

        expect(response.status).to.equal(200);
    })
    
    it("test post_sign_view, return payload", async function(){
        const mock = sinon.fake.returns("dfsdfs")
        sinon.replace(Handler, "error_handle", sinon.fake())
        sinon.replace(Offer_Bridge, "post_sign_bridge", mock)
        
        const view = new Offer_View()
        const response = await view.post_sign_view(post_sign_req(null, null), res())

        expect(response.json).to.equal('dfsdfs');
    })
    
    it("test post_sign_view, error occured, delegate res to error_handle", async function(){
        const mock = sinon.fake()
        sinon.replace(Handler, "error_handle", mock)
        sinon.replace(Offer_Bridge, "post_sign_bridge", sinon.fake.throws(new Error()))
        
        const view = new Offer_View()
        const response = await view.post_sign_view(post_sign_req(null, null), 'dfsdfs')

        expect(mock.args[0][0]).to.equal('dfsdfs');
    })
    
    it("test post_sign_view, error occured, delegate err to error_handle", async function(){
        const mock = sinon.fake()
        sinon.replace(Handler, "error_handle", mock)
        sinon.replace(Offer_Bridge, "post_sign_bridge", sinon.fake.throws(new Error('testing message')))
        
        const view = new Offer_View()
        const response = await view.post_sign_view(post_sign_req(null, null), res())

        expect(mock.args[0][1].message).to.equal('testing message');
    })

    it("test put_sign_view, delegate offer_id to put_sign_bridge", async function(){
        const mock = sinon.fake()
        sinon.replace(Handler, "error_handle", sinon.fake())
        sinon.replace(Offer_Bridge, "put_sign_bridge", mock)
        
        const view = new Offer_View()
        const response = await view.put_sign_view(put_sign_req('dummy'), res())

        expect(mock.args[0][0]).to.equal('dummy');
    })
    
    it("test put_sign_view, delegate user.type to put_sign_bridge", async function(){
        const mock = sinon.fake()
        sinon.replace(Handler, "error_handle", sinon.fake())
        sinon.replace(Offer_Bridge, "put_sign_bridge", mock)
        
        const view = new Offer_View()
        const response = await view.put_sign_view(put_sign_req(), res())

        expect(mock.args[0][1]).to.equal('dummy type');
    })
    
    it("test put_sign_view, delegate user.email to put_sign_bridge", async function(){
        const mock = sinon.fake()
        sinon.replace(Handler, "error_handle", sinon.fake())
        sinon.replace(Offer_Bridge, "put_sign_bridge", mock)
        
        const view = new Offer_View()
        const response = await view.put_sign_view(put_sign_req(), res())

        expect(mock.args[0][2]).to.equal('dummy email');
    })
    
    it("test put_sign_view, delegate signature to put_sign_bridge", async function(){
        const mock = sinon.fake()
        sinon.replace(Handler, "error_handle", sinon.fake())
        sinon.replace(Offer_Bridge, "put_sign_bridge", mock)
        
        const view = new Offer_View()
        const response = await view.put_sign_view(put_sign_req(null, 'random'), res())

        expect(mock.args[0][3]).to.equal('random');
    })
    
    it("test put_sign_view, delegate chain_address to put_sign_bridge", async function(){
        const mock = sinon.fake()
        sinon.replace(Handler, "error_handle", sinon.fake())
        sinon.replace(Offer_Bridge, "put_sign_bridge", mock)
        
        const view = new Offer_View()
        const response = await view.put_sign_view(put_sign_req(null, null), res())

        expect(mock.args[0][4]).to.equal('dummy address');
    })
    
    it("test put_sign_view, delegate user.name to put_sign_bridge", async function(){
        const mock = sinon.fake()
        sinon.replace(Handler, "error_handle", sinon.fake())
        sinon.replace(Offer_Bridge, "put_sign_bridge", mock)
        
        const view = new Offer_View()
        const response = await view.put_sign_view(put_sign_req(null, null), res())

        expect(mock.args[0][5]).to.equal('dummy name');
    })
    
    it("test put_sign_view, delegate sequelize to put_sign_bridge", async function(){
        const mock = sinon.fake()
        sinon.replace(Handler, "error_handle", sinon.fake())
        sinon.replace(Offer_Bridge, "put_sign_bridge", mock)
        
        const view = new Offer_View('hi')
        const response = await view.put_sign_view(put_sign_req(null, null), res())

        expect(mock.args[0][6]).to.equal('hi');
    })
    
    it("test put_sign_view, return status 200", async function(){
        const mock = sinon.fake()
        sinon.replace(Handler, "error_handle", sinon.fake())
        sinon.replace(Offer_Bridge, "put_sign_bridge", mock)
        
        const view = new Offer_View()
        const response = await view.put_sign_view(put_sign_req(null, null), res())

        expect(response.status).to.equal(200);
    })
    
    it("test put_sign_view, return payload", async function(){
        const mock = sinon.fake.returns("dfsdfs")
        sinon.replace(Handler, "error_handle", sinon.fake())
        sinon.replace(Offer_Bridge, "put_sign_bridge", mock)
        
        const view = new Offer_View()
        const response = await view.put_sign_view(put_sign_req(null, null), res())

        expect(response.json).to.equal('dfsdfs');
    })
    
    it("test put_sign_view, error occured, delegate res to error_handle", async function(){
        const mock = sinon.fake()
        sinon.replace(Handler, "error_handle", mock)
        sinon.replace(Offer_Bridge, "put_sign_bridge", sinon.fake.throws(new Error()))
        
        const view = new Offer_View()
        const response = await view.put_sign_view(put_sign_req(null, null), 'dfsdfs')

        expect(mock.args[0][0]).to.equal('dfsdfs');
    })
    
    it("test put_sign_view, error occured, delegate err to error_handle", async function(){
        const mock = sinon.fake()
        sinon.replace(Handler, "error_handle", mock)
        sinon.replace(Offer_Bridge, "put_sign_bridge", sinon.fake.throws(new Error('testing message')))
        
        const view = new Offer_View()
        const response = await view.put_sign_view(put_sign_req(null, null), 'dfsdfs')

        expect(mock.args[0][1].message).to.equal('testing message');
    })
    
    it("test put_reject_view, delegate id to bridge", async function(){
        const mock = sinon.fake()
        sinon.replace(Handler, "error_handle", sinon.fake())
        sinon.replace(Offer_Bridge, "put_reject_bridge", mock)
        
        const view = new Offer_View()
        const response = await view.put_reject_view(put_accept_req('1234'), res())

        expect(mock.args[0][0]).to.equal('1234');
    })
    
    it("test put_reject_view, delegate email to bridge", async function(){
        const mock = sinon.fake()
        sinon.replace(Handler, "error_handle", sinon.fake())
        sinon.replace(Offer_Bridge, "put_reject_bridge", mock)
        
        const view = new Offer_View()
        const response = await view.put_reject_view(put_accept_req('1234'), res())

        expect(mock.args[0][1]).to.equal('dummy email');
    })
    
    it("test put_reject_view, delegate name to bridge", async function(){
        const mock = sinon.fake()
        sinon.replace(Handler, "error_handle", sinon.fake())
        sinon.replace(Offer_Bridge, "put_reject_bridge", mock)
        
        const view = new Offer_View()
        const response = await view.put_reject_view(put_accept_req(), res())

        expect(mock.args[0][2]).to.equal('dummy name');
    })
    
    it("test put_reject_view, delegate user type to bridge", async function(){
        const mock = sinon.fake()
        sinon.replace(Handler, "error_handle", sinon.fake())
        sinon.replace(Offer_Bridge, "put_reject_bridge", mock)
        
        const view = new Offer_View('sdfsdf')
        const response = await view.put_reject_view(put_accept_req('1234'), res())

        expect(mock.args[0][3]).to.equal('dummy type');
    })
    
    it("test put_reject_view, delegate sequelize to bridge", async function(){
        const mock = sinon.fake()
        sinon.replace(Handler, "error_handle", sinon.fake())
        sinon.replace(Offer_Bridge, "put_reject_bridge", mock)
        
        const view = new Offer_View('sdfsdf')
        const response = await view.put_reject_view(put_accept_req('1234'), res())

        expect(mock.args[0][4]).to.equal('sdfsdf');
    })
    
    it("test put_reject_view, return status 200", async function(){
        const mock = sinon.fake()
        sinon.replace(Handler, "error_handle", sinon.fake())
        sinon.replace(Offer_Bridge, "put_reject_bridge", mock)
        
        const view = new Offer_View('sdfsdf')
        const response = await view.put_reject_view(put_accept_req('1234'), res())

        expect(response.status).to.equal(200);
    })
    
    it("test put_reject_view, return payload", async function(){
        const mock = sinon.fake.returns("hi")
        sinon.replace(Handler, "error_handle", sinon.fake())
        sinon.replace(Offer_Bridge, "put_reject_bridge", mock)
        
        const view = new Offer_View('sdfsdf')
        const response = await view.put_reject_view(put_accept_req('1234'), res())

        expect(response.json).to.equal('hi');
    })
    
    it("test put_reject_view, error occured, delegate res to error handle", async function(){
        const mock = sinon.fake.returns("hi")
        sinon.replace(Handler, "error_handle", mock)
        sinon.replace(Offer_Bridge, "put_reject_bridge", sinon.fake())
        
        const view = new Offer_View('sdfsdf')
        const response = await view.put_reject_view(put_accept_req('1234'), 'sdf')

        expect(mock.args[0][0]).to.equal('sdf');
    })
    
    it("test put_reject_view, error occured, delegate err to error handle", async function(){
        const mock = sinon.fake.returns("hi")
        sinon.replace(Handler, "error_handle", mock)
        sinon.replace(Offer_Bridge, "put_reject_bridge", sinon.fake.throws(new Error('sdf')))
        
        const view = new Offer_View('sdfsdf')
        const response = await view.put_reject_view(put_accept_req('1234'), res())

        expect(mock.args[0][1].message).to.equal('sdf');
    })
        
    it("test put_remove_view, delegate id to bridge", async function(){
        const mock = sinon.fake()
        sinon.replace(Handler, "error_handle", sinon.fake())
        sinon.replace(Offer_Bridge, "put_remove_bridge", mock)
        
        const view = new Offer_View()
        const response = await view.put_remove_view(put_accept_req('1234'), res())

        expect(mock.args[0][0]).to.equal('1234');
    })
    
    it("test put_remove_view, delegate email to bridge", async function(){
        const mock = sinon.fake()
        sinon.replace(Handler, "error_handle", sinon.fake())
        sinon.replace(Offer_Bridge, "put_remove_bridge", mock)
        
        const view = new Offer_View()
        const response = await view.put_remove_view(put_accept_req('1234'), res())

        expect(mock.args[0][1]).to.equal('dummy email');
    })
    
    it("test put_remove_view, delegate name to bridge", async function(){
        const mock = sinon.fake()
        sinon.replace(Handler, "error_handle", sinon.fake())
        sinon.replace(Offer_Bridge, "put_remove_bridge", mock)
        
        const view = new Offer_View()
        const response = await view.put_remove_view(put_accept_req(), res())

        expect(mock.args[0][2]).to.equal('dummy name');
    })
    
    it("test put_remove_view, delegate user type to bridge", async function(){
        const mock = sinon.fake()
        sinon.replace(Handler, "error_handle", sinon.fake())
        sinon.replace(Offer_Bridge, "put_remove_bridge", mock)
        
        const view = new Offer_View('sdfsdf')
        const response = await view.put_remove_view(put_accept_req('1234'), res())

        expect(mock.args[0][3]).to.equal('dummy type');
    })
    
    it("test put_remove_view, delegate sequelize to bridge", async function(){
        const mock = sinon.fake()
        sinon.replace(Handler, "error_handle", sinon.fake())
        sinon.replace(Offer_Bridge, "put_remove_bridge", mock)
        
        const view = new Offer_View('sdfsdf')
        const response = await view.put_remove_view(put_accept_req('1234'), res())

        expect(mock.args[0][4]).to.equal('sdfsdf');
    })
    
    it("test put_remove_view, return status 200", async function(){
        const mock = sinon.fake()
        sinon.replace(Handler, "error_handle", sinon.fake())
        sinon.replace(Offer_Bridge, "put_remove_bridge", mock)
        
        const view = new Offer_View('sdfsdf')
        const response = await view.put_remove_view(put_accept_req('1234'), res())

        expect(response.status).to.equal(200);
    })
    
    it("test put_remove_view, return payload", async function(){
        const mock = sinon.fake.returns("hi")
        sinon.replace(Handler, "error_handle", sinon.fake())
        sinon.replace(Offer_Bridge, "put_remove_bridge", mock)
        
        const view = new Offer_View('sdfsdf')
        const response = await view.put_remove_view(put_accept_req('1234'), res())

        expect(response.json).to.equal('hi');
    })
    
    it("test put_remove_view, error occured, delegate res to error handle", async function(){
        const mock = sinon.fake.returns("hi")
        sinon.replace(Handler, "error_handle", mock)
        sinon.replace(Offer_Bridge, "put_remove_bridge", sinon.fake())
        
        const view = new Offer_View('sdfsdf')
        const response = await view.put_remove_view(put_accept_req('1234'), 'sdf')

        expect(mock.args[0][0]).to.equal('sdf');
    })
    
    it("test put_remove_view, error occured, delegate err to error handle", async function(){
        const mock = sinon.fake.returns("hi")
        sinon.replace(Handler, "error_handle", mock)
        sinon.replace(Offer_Bridge, "put_remove_bridge", sinon.fake.throws(new Error('sdf')))
        
        const view = new Offer_View('sdfsdf')
        const response = await view.put_remove_view(put_accept_req('1234'), res())

        expect(mock.args[0][1].message).to.equal('sdf');
    })

    it("test put_terminate_view, delegate id to bridge", async function(){
        const mock = sinon.fake()
        sinon.replace(Handler, "error_handle", sinon.fake())
        sinon.replace(Offer_Bridge, "put_terminate_bridge", mock)
        
        const view = new Offer_View()
        const response = await view.put_terminate_view(put_sign_req('23432'), res())

        expect(mock.args[0][0]).to.equal('23432');
    })

    it("test put_terminate_view, delegate signature to bridge", async function(){
        const mock = sinon.fake()
        sinon.replace(Handler, "error_handle", sinon.fake())
        sinon.replace(Offer_Bridge, "put_terminate_bridge", mock)
        
        const view = new Offer_View()
        const response = await view.put_terminate_view(put_sign_req(null, "sdfsd"), res())

        expect(mock.args[0][1]).to.equal('sdfsd');
    })

    it("test put_terminate_view, delegate req.user.email to bridge", async function(){
        const mock = sinon.fake()
        sinon.replace(Handler, "error_handle", sinon.fake())
        sinon.replace(Offer_Bridge, "put_terminate_bridge", mock)
        
        const view = new Offer_View()
        const response = await view.put_terminate_view(put_sign_req(), res())

        expect(mock.args[0][2]).to.equal('dummy email');
    })

    it("test put_terminate_view, delegate req.user.name to bridge", async function(){
        const mock = sinon.fake()
        sinon.replace(Handler, "error_handle", sinon.fake())
        sinon.replace(Offer_Bridge, "put_terminate_bridge", mock)
        
        const view = new Offer_View()
        const response = await view.put_terminate_view(put_sign_req(), res())

        expect(mock.args[0][3]).to.equal('dummy name');
    })

    it("test put_terminate_view, delegate req.user.type to bridge", async function(){
        const mock = sinon.fake()
        sinon.replace(Handler, "error_handle", sinon.fake())
        sinon.replace(Offer_Bridge, "put_terminate_bridge", mock)
        
        const view = new Offer_View()
        const response = await view.put_terminate_view(put_sign_req(), res())

        expect(mock.args[0][4]).to.equal('dummy type');
    })

    it("test put_terminate_view, delegate sequelize to bridge", async function(){
        const mock = sinon.fake()
        sinon.replace(Handler, "error_handle", sinon.fake())
        sinon.replace(Offer_Bridge, "put_terminate_bridge", mock)
        
        const view = new Offer_View("seqerf")
        const response = await view.put_terminate_view(put_sign_req(), res())

        expect(mock.args[0][5]).to.equal('seqerf');
    })

    it("test put_terminate_view, success, return status 200", async function(){
        const mock = sinon.fake()
        sinon.replace(Handler, "error_handle", sinon.fake())
        sinon.replace(Offer_Bridge, "put_terminate_bridge", mock)
        
        const view = new Offer_View("seqerf")
        const response = await view.put_terminate_view(put_sign_req(), res())

        expect(response.status).to.equal(200);
    })

    it("test put_terminate_view, success, return payload 200", async function(){
        const mock = sinon.fake.returns("sdfsdlfewr")
        sinon.replace(Handler, "error_handle", sinon.fake())
        sinon.replace(Offer_Bridge, "put_terminate_bridge", mock)
        
        const view = new Offer_View("seqerf")
        const response = await view.put_terminate_view(put_sign_req(), res())

        expect(response.json).to.equal("sdfsdlfewr");
    })

    it("test put_terminate_view, error occur, delegate to res to error_handle", async function(){
        const mock = sinon.fake()
        sinon.replace(Offer_Bridge, "put_terminate_bridge", sinon.fake.throws(new Error()))
        sinon.replace(Handler, "error_handle", mock)
        
        const view = new Offer_View("seqerf")
        const response = await view.put_terminate_view(put_sign_req(), ';sdfsdf')

        expect(mock.args[0][0]).to.equal(";sdfsdf");
    })

    it("test put_terminate_view, error occur, delegate to res to error_handle", async function(){
        const mock = sinon.fake()
        sinon.replace(Offer_Bridge, "put_terminate_bridge", sinon.fake.throws(new Error("sgfsrgfsg")))
        sinon.replace(Handler, "error_handle", mock)
        
        const view = new Offer_View("seqerf")
        const response = await view.put_terminate_view(put_sign_req(), ';sdfsdf')

        expect(mock.args[0][1].message).to.equal("sgfsrgfsg");
    })

    it("test put_terminate_view, error occur, return return of error_handle", async function(){
        const mock = sinon.fake.returns("hi")
        sinon.replace(Offer_Bridge, "put_terminate_bridge", sinon.fake.throws(new Error("sgfsrgfsg")))
        sinon.replace(Handler, "error_handle", mock)
        
        const view = new Offer_View("seqerf")
        const response = await view.put_terminate_view(put_sign_req(), ';sdfsdf')

        expect(response).to.equal("hi");
    })

    it("test post_terminate_view, delegate offer_id to post_terminate_bridge", async function(){
        const mock = sinon.fake()
        sinon.replace(Handler, "error_handle", sinon.fake())
        sinon.replace(Offer_Bridge, "post_terminate_bridge", mock)
        
        const view = new Offer_View()
        const response = await view.post_terminate_view(post_sign_req('dummy'), res())

        expect(mock.args[0][0]).to.equal('dummy');
    })

    it("test post_terminate_view, delegate secret to post_terminate_bridge", async function(){
        const mock = sinon.fake()
        sinon.replace(Handler, "error_handle", sinon.fake())
        sinon.replace(Offer_Bridge, "post_terminate_bridge", mock)
        
        const view = new Offer_View()
        const response = await view.post_terminate_view(post_sign_req('dummy', 'sdflsdkjf'), res())

        expect(mock.args[0][1]).to.equal('sdflsdkjf');
    })

    it("test post_terminate_view, delegate secret to post_terminate_bridge", async function(){
        const mock = sinon.fake()
        sinon.replace(Handler, "error_handle", sinon.fake())
        sinon.replace(Offer_Bridge, "post_terminate_bridge", mock)
        
        const view = new Offer_View()
        const response = await view.post_terminate_view(post_sign_req(null, null), res())

        expect(mock.args[0][2]).to.equal('dummy email');
    })

    it("test post_terminate_view, delegate sequelize to post_terminate_bridge", async function(){
        const mock = sinon.fake()
        sinon.replace(Handler, "error_handle", sinon.fake())
        sinon.replace(Offer_Bridge, "post_terminate_bridge", mock)
        
        const view = new Offer_View('sdfsd')
        const response = await view.post_terminate_view(post_sign_req(null, null), res())

        expect(mock.args[0][3]).to.equal('sdfsd');
    })
        
    it("test post_terminate_view, return status 200", async function(){
        const mock = sinon.fake()
        sinon.replace(Handler, "error_handle", sinon.fake())
        sinon.replace(Offer_Bridge, "post_terminate_bridge", mock)
        
        const view = new Offer_View()
        const response = await view.post_terminate_view(post_sign_req(null, null), res())

        expect(response.status).to.equal(200);
    })
    
    it("test post_terminate_view, return payload", async function(){
        const mock = sinon.fake.returns("dfsdfs")
        sinon.replace(Handler, "error_handle", sinon.fake())
        sinon.replace(Offer_Bridge, "post_terminate_bridge", mock)
        
        const view = new Offer_View()
        const response = await view.post_terminate_view(post_sign_req(null, null), res())

        expect(response.json).to.equal('dfsdfs');
    })
    
    it("test post_terminate_view, error occured, delegate res to error_handle", async function(){
        const mock = sinon.fake()
        sinon.replace(Handler, "error_handle", mock)
        sinon.replace(Offer_Bridge, "post_terminate_bridge", sinon.fake.throws(new Error()))
        
        const view = new Offer_View()
        const response = await view.post_terminate_view(post_sign_req(null, null), 'dfsdfs')

        expect(mock.args[0][0]).to.equal('dfsdfs');
    })
    
    it("test post_terminate_view, error occured, delegate err to error_handle", async function(){
        const mock = sinon.fake()
        sinon.replace(Handler, "error_handle", mock)
        sinon.replace(Offer_Bridge, "post_terminate_bridge", sinon.fake.throws(new Error('testing message')))
        
        const view = new Offer_View()
        const response = await view.post_terminate_view(post_sign_req(null, null), res())

        expect(mock.args[0][1].message).to.equal('testing message');
    })

})