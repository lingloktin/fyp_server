const nodemailer = require("nodemailer")
const {email} = require("../config.js")


class Email_Service {
    #transporter 

    constructor(){
        this.#transporter = nodemailer.createTransport({
            service: 'gmail', 
            auth:{
                user: email.address,
                pass: email.password
            }
        })
    }

    async send_offer(receiver_email, receiver_name, company_name, job_title, password, file_name, file_buffer){
        var receiver_name = (receiver_name===undefined)? "candidate":receiver_name
        const mailOptions = {
            from: email.address,
            to: receiver_email,
            subject: 'Offer Notice Email',
            attachments:[{
                filename: file_name,
                content: file_buffer
            }],
            html: `
            <p>Hi ${receiver_name}, <p>

            <p></p>

            <p>Congratulations, <b>${company_name}</b> would like to offer you the job -- <b>${job_title}</b>. <br>
            Please find the attached pre-draft contract and decrypt it with the password: <b>${password}</b>. <br>
            Please login to your account and make your action. <br>
            Please create an account to do so if you don't have one. </p>
            
            <p></p>

            <p>Regards,<br>fyp platform</p>
            `  
        }

        try{
            await this.#transporter.sendMail(mailOptions)
        }
        catch(err){
            throw new Error("email sending error")
        }
    }

    async send_alert(receiver_email, receiver_name, sender_name, offer_id, status, extra_message){
        const extra = (extra_message===null)? "": extra_message
        const mailOptions = {
            from: email.address,
            to: receiver_email,
            subject: 'Alert Email',
            html: `
            <p>Hi ${receiver_name}, <p>

            <p></p>

            <p> ${sender_name} has made an action to the offer (id: <b>${offer_id}</b>). The current status of the offer is <b>${status}</b>. </p>
            <p>${extra}</p>

            
            <p></p>

            <p>Regards,<br>fyp platform</p>
            `  
        }

        try{
            await this.#transporter.sendMail(mailOptions)
        }
        catch(err){
            throw new Error("email sending error")
        }
    }
}

module.exports.Email_Service = Email_Service;