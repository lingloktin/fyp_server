const { expect } = require("chai");
const sinon = require("sinon");
const {Account_View} = require("../../account/account_view.js")
const {Account_Bridge} = require("../../account/account_bridge.js")
const {Response} = require("../../util/response.js")

const req = (email="dummy") => {return {            
    params: {
        email: email,
    }
}}

const post_req = (email=null, password=null, name=null, chain_address=null, type=null, id=null) => {return {            
    body: {
        email: email,
        password: password,
        name: name, 
        chain_address: chain_address, 
        type: type,
        id: id
    }
}}

const res = () => { return{
    status: (code)=> {
        return {
            json: (payload)=>{return {
                status: code,
                json: payload
            }}
        }
    }
}}

describe("Account_View", function(){
    this.afterEach(function(){
        sinon.restore();
    })

    it("test create method, delegate email to create_account_bridge function", function(){
        const mock = sinon.fake.returns(null)
        sinon.replace(Account_Bridge.prototype, "create_account_bridge", mock)
        
        const view = new Account_View()
        view.create(post_req(email="dummy"), res())

        //assertion
        expect(mock.args[0][0]).to.equal('dummy');
    })
    
    it("test create method, delegate password to create_account_bridge function", function(){
        const mock = sinon.fake.returns(null)
        sinon.replace(Account_Bridge.prototype, "create_account_bridge", mock)
        
        const view = new Account_View()
        view.create(post_req(null, "dummy"), res())

        //assertion
        expect(mock.args[0][1]).to.equal('dummy');
    })
    
    it("test create method, delegate name to create_account_bridge function", function(){
        const mock = sinon.fake.returns(null)
        sinon.replace(Account_Bridge.prototype, "create_account_bridge", mock)
        
        const view = new Account_View()
        view.create(post_req(null, null, "dummy"), res())

        //assertion
        expect(mock.args[0][2]).to.equal('dummy');
    })
    
    it("test create method, delegate chain_addreess to create_account_bridge function", function(){
        const mock = sinon.fake.returns(null)
        sinon.replace(Account_Bridge.prototype, "create_account_bridge", mock)
        
        const view = new Account_View()
        view.create(post_req(null, null, null, "dummy"), res())

        //assertion
        expect(mock.args[0][3]).to.equal('dummy');
    })
    
    it("test create method, delegate type to create_account_bridge function", function(){
        const mock = sinon.fake.returns(null)
        sinon.replace(Account_Bridge.prototype, "create_account_bridge", mock)
        
        const view = new Account_View()
        view.create(post_req(null, null, null, null,"dummy"), res())

        //assertion
        expect(mock.args[0][4]).to.equal('dummy');
    })
    
    it("test create method, delegate id to create_account_bridge function", function(){
        const mock = sinon.fake.returns(null)
        sinon.replace(Account_Bridge.prototype, "create_account_bridge", mock)
        
        const view = new Account_View()
        view.create(post_req(null, null, null, null, null, "dummy"), res())

        //assertion
        expect(mock.args[0][5]).to.equal('dummy');
    })
        
    it("test create method, delegate sequelize to create_account_bridge function", function(){
        const mock = sinon.fake.returns(null)
        sinon.replace(Account_Bridge.prototype, "create_account_bridge", mock)
        const seq = sinon.fake(); 

        const view = new Account_View(seq)
        view.create(post_req(), res())

        expect(mock.args[0][6]).to.equal(seq);
    })
        
    it("test create method, error occur, return relevant status", async function(){
        sinon.stub(Account_Bridge.prototype, "create_account_bridge").throws(new Response(10, null))
        const seq = sinon.fake(); 

        const view = new Account_View(seq)
        const response = await view.create(post_req(), res())

        expect(response.status).to.equal(10);    
    })
        
    it("test create method, error occur, return payload", async function(){
        sinon.stub(Account_Bridge.prototype, "create_account_bridge").throws(new Response(null, "dummy"))
        const seq = sinon.fake(); 

        const view = new Account_View(seq)
        const response = await view.create(post_req(), res())

        expect(response.json).to.equal("dummy");    
    })
        
    it("test create method, no error, return status 200", async function(){
        const mock = sinon.fake.returns({email: "45r4@gmail.com"})
        sinon.replace(Account_Bridge.prototype, "create_account_bridge", mock)
        const seq = sinon.fake(); 

        const view = new Account_View(seq)
        const response = await view.create(post_req(), res())

        expect(response.status).to.equal(200);    
    })
        
    it("test create method, no error, return payload", async function(){
        const mock = sinon.fake.returns({email: "45r4@gmail.com"})
        sinon.replace(Account_Bridge.prototype, "create_account_bridge", mock)
        const seq = sinon.fake(); 

        const view = new Account_View(seq)
        const response = await view.create(post_req(), res())

        expect(response.json).to.eql({email: "45r4@gmail.com"});    
    })
    
    it("test login method, delegate email to login_bridge function", function(){
        const mock = sinon.fake.returns(null)
        sinon.replace(Account_Bridge.prototype, "login_bridge", mock)
        
        const view = new Account_View()
        view.login(post_req(email="dummy"), res())

        //assertion
        expect(mock.args[0][0]).to.equal('dummy');
    })
    
    it("test login method, delegate password to login_bridge function", function(){
        const mock = sinon.fake.returns(null)
        sinon.replace(Account_Bridge.prototype, "login_bridge", mock)
        
        const view = new Account_View()
        view.login(post_req(null, "dummy"), res())

        //assertion
        expect(mock.args[0][1]).to.equal('dummy');
    })
        
    it("test login method, delegate sequelize to login_bridge function", function(){
        const mock = sinon.fake.returns(null)
        sinon.replace(Account_Bridge.prototype, "login_bridge", mock)
        const seq = sinon.fake(); 

        const view = new Account_View(seq)
        view.login(post_req(), res())

        expect(mock.args[0][2]).to.equal(seq);
    })
        
    it("test login method, error occur, return status", async function(){
        sinon.stub(Account_Bridge.prototype, "login_bridge").throws(new Response(10, null))
        const seq = sinon.fake(); 

        const view = new Account_View(seq)
        const response = await view.login(post_req(), res())

        expect(response.status).to.equal(10);    
    })
        
    it("test login method, error occur, return payload", async function(){
        sinon.stub(Account_Bridge.prototype, "login_bridge").throws(new Response(null, "dummy"))
        const seq = sinon.fake(); 

        const view = new Account_View(seq)
        const response = await view.login(post_req(), res())

        expect(response.json).to.equal("dummy");    
    })
        
    it("test login method, successfully login, return status 201", async function(){
        const mock = sinon.fake.returns({email: "45r4@gmail.com"})
        sinon.replace(Account_Bridge.prototype, "login_bridge", mock)
        const seq = sinon.fake(); 

        const view = new Account_View(seq)
        const response = await view.login(post_req(), res())

        expect(response.status).to.equal(201);    
    })
        
    it("test login method, successfully login, return payload", async function(){
        const mock = sinon.fake.returns({email: "45r4@gmail.com"})
        sinon.replace(Account_Bridge.prototype, "login_bridge", mock)
        const seq = sinon.fake(); 

        const view = new Account_View(seq)
        const response = await view.login(post_req(), res())

        expect(response.json).to.eql({email: "45r4@gmail.com"});    
    })
})