const sinon = require("sinon");
const { expect } = require("chai");
const nodemailer = require("nodemailer")
const {Email_Service} = require("../../service/email_service.js")
const {Contract_Service} = require("../../service/contract_service.js")
const fs = require("fs")
const {email} = require("../../config.js")



describe("Email_Service", function(){
    this.afterEach(function(){
        sinon.restore();
    })

    it("test constructor, delegate email address to user", async function(){
        //setup
        const nodemailer_mock = sinon.fake.returns(null)
        sinon.replace(nodemailer, "createTransport", nodemailer_mock)

        //execution
        const email_service = new Email_Service()

        //assertion
        expect(nodemailer_mock.args[0][0].auth.user).to.equal(email.address)
    })

    it("test constructor, delegate email password to user", async function(){
        const nodemailer_mock = sinon.fake.returns(null)
        sinon.replace(nodemailer, "createTransport", nodemailer_mock)

        const email_service = new Email_Service()

        expect(nodemailer_mock.args[0][0].auth.pass).to.equal(email.password)
    })

    it("test send_offer, delegate email address to from in mailOptions", async function(){
        const nodemailer_mock = sinon.fake.returns(null)
        sinon.replace(nodemailer, "createTransport", sinon.fake.returns({sendMail: nodemailer_mock}))

        const email_service = new Email_Service()
        const response = await email_service.send_offer(null, null, null, null, null, null, null)

        expect(nodemailer_mock.args[0][0].from).to.equal(email.address)
    })

    it("test send_offer, delegate email receiver_email to to in mailOptions", async function(){
        const nodemailer_mock = sinon.fake.returns(null)
        sinon.replace(nodemailer, "createTransport", sinon.fake.returns({sendMail: nodemailer_mock}))

        const email_service = new Email_Service()
        const response = await email_service.send_offer("receiver_email", null, null, null, null, null, null)

        expect(nodemailer_mock.args[0][0].to).to.equal("receiver_email")
    })

    it("test send_offer, delegate filename to attachments in mailOptions", async function(){
        const nodemailer_mock = sinon.fake.returns(null)
        sinon.replace(nodemailer, "createTransport", sinon.fake.returns({sendMail: nodemailer_mock}))

        const email_service = new Email_Service()
        const response = await email_service.send_offer(null, null, null, null, null, "dummy", null)

        expect(nodemailer_mock.args[0][0].attachments[0].filename).to.equal("dummy")
    })

    it("test send_offer, delegate file_buffer to attachments in mailOptions", async function(){
        const nodemailer_mock = sinon.fake.returns(null)
        sinon.replace(nodemailer, "createTransport", sinon.fake.returns({sendMail: nodemailer_mock}))

        const email_service = new Email_Service()
        const response = await email_service.send_offer(null, null, null, null, null, null, "dummy")

        expect(nodemailer_mock.args[0][0].attachments[0].content).to.equal("dummy")
    })

    it("test send_offer, delegate  to subject in mailOptions", async function(){
        const nodemailer_mock = sinon.fake.returns(null)
        sinon.replace(nodemailer, "createTransport", sinon.fake.returns({sendMail: nodemailer_mock}))

        const email_service = new Email_Service()
        const response = await email_service.send_offer(null, null, null, null, null, null, null)

        expect(nodemailer_mock.args[0][0].subject).to.equal("Offer Notice Email")
    })

    it("test send_offer, error occur, return false", async function(){
        var error
        const nodemailer_mock = sinon.fake.throws(new Error())
        sinon.replace(nodemailer, "createTransport", sinon.fake.returns({sendMail: nodemailer_mock}))

        const email_service = new Email_Service()
        try { await email_service.send_offer(null, null, null, null, null, null, null) }
        catch(err) { error = err}

        expect(error.message).to.equal("email sending error")
    })

    it("test send_offer, successfully sent, return undefined", async function(){
        const nodemailer_mock = sinon.fake.returns(null)
        sinon.replace(nodemailer, "createTransport", sinon.fake.returns({sendMail: nodemailer_mock}))

        const email_service = new Email_Service()
        const response = await email_service.send_offer(null, null, null, null, null, null, null)

        expect(response).to.equal(undefined)
    })
/////////////////////////////////////////////////////////////////////////////

    it("test send_alert, delegate email address to from in mailOptions", async function(){
        const nodemailer_mock = sinon.fake.returns(null)
        sinon.replace(nodemailer, "createTransport", sinon.fake.returns({sendMail: nodemailer_mock}))

        const email_service = new Email_Service()
        const response = await email_service.send_alert(null, null, null, null, null, null)

        expect(nodemailer_mock.args[0][0].from).to.equal(email.address)
    })

    it("test send_alert, delegate email receiver_email to to in mailOptions", async function(){
        const nodemailer_mock = sinon.fake.returns(null)
        sinon.replace(nodemailer, "createTransport", sinon.fake.returns({sendMail: nodemailer_mock}))

        const email_service = new Email_Service()
        const response = await email_service.send_alert("receiver_email", null, null, null, null, null, null)

        expect(nodemailer_mock.args[0][0].to).to.equal("receiver_email")
    })

    it("test send_alert, delegate Aleart Email to subject in mailOptions", async function(){
        const nodemailer_mock = sinon.fake.returns(null)
        sinon.replace(nodemailer, "createTransport", sinon.fake.returns({sendMail: nodemailer_mock}))

        const email_service = new Email_Service()
        const response = await email_service.send_alert(null, null, null, null, null, null, null)

        expect(nodemailer_mock.args[0][0].subject).to.equal("Alert Email")
    })

    it("test send_alert, error occur, return false", async function(){
        var error
        const nodemailer_mock = sinon.fake.throws(new Error())
        sinon.replace(nodemailer, "createTransport", sinon.fake.returns({sendMail: nodemailer_mock}))

        const email_service = new Email_Service()
        try { await email_service.send_alert(null, null, null, null, null, null, null) }
        catch(err) { error = err}

        expect(error.message).to.equal("email sending error")
    })

    it("test send_alert, successfully sent, return undefined", async function(){
        const nodemailer_mock = sinon.fake.returns(null)
        sinon.replace(nodemailer, "createTransport", sinon.fake.returns({sendMail: nodemailer_mock}))

        const email_service = new Email_Service()
        const response = await email_service.send_alert(null, null, null, null, null, null, null)

        expect(response).to.equal(undefined)
    })

})