const ethers = require("ethers")
const {Email_Service} = require("../service/email_service.js")
const {Util_Service} = require("../service/util_service.js")
const {Contract_Service} = require("../service/contract_service.js")
const {Agreement} = require("../model/agreement.js")
const {Account} = require("../model/account.js")
const {Response} = require("../util/response.js")
const { contractAddress, agreement_status, account_type, currentTimeStamp, ipfs} = require("../config.js")
const { NFT_Service } = require("../service/NFT_service.js")
const { Handler } = require("../util/handler.js")
const INDIVIDUAL = account_type.INDIVIDUAL
const BUSINESS = account_type.BUSINESS
const REQ_REVIEW = agreement_status.REQ_REVIEW
const REQ_SIGN = agreement_status.REQ_SIGN
const COMPLETED = agreement_status.COMPLETED
const TERMINATED = agreement_status.TERMINATED
const REJECTED = agreement_status.REJECTED
const REMOVED = agreement_status.REMOVED
const REQ_MODIFY = agreement_status.REQ_MODIFY
const SIGNED = agreement_status.SIGNED

class Offer_Bridge {
    
    //orchestrate different service to complete post method 
    static async post_bridge(
        job_title, candidate_email, company_email, company_name, 
        contract_name, contract_file, password, job_description, sequalize){

        const agreement_db = new Agreement(sequalize)
        const account_db = new Account(sequalize)

        //check if all mandatory field exists 
        Util_Service.mandatory_field_checking({
            job_title: job_title, 
            candidate_email: candidate_email,
            contract: contract_file, 
            password: password
        })

        //encrypt pdf
        const encrypted_buffer = Contract_Service.encryption(contract_file, password)

        //store to db
        const data = await agreement_db.create(
            job_title, candidate_email, company_email, encrypted_buffer, REQ_REVIEW, job_description)

        //get candidate name 
        const candidate_name = await account_db.findOne({email: candidate_email}).name

        //send email
        const email_service = new Email_Service()
        await email_service.send_offer(candidate_email, candidate_name, 
            company_name, job_title, password, contract_name, encrypted_buffer)

        //return success response
        return {id: data.id, createdAt: data.createdAt}
    }

    //orchestrate different service to complete get method 
    static async get_bridge(email, account_type, status_query_list, sequelize){
        const agreement_db = new Agreement(sequelize)
        const types = [REQ_REVIEW, REQ_SIGN, COMPLETED, REJECTED, REMOVED, REQ_MODIFY, TERMINATED] 
        const query_key = (account_type==INDIVIDUAL)? "candidate_email": "company_email"
        const current_sig = (account_type==INDIVIDUAL)? "candidate_sig": "company_sig"
        var status =[]

        //update checking query list
        if (Util_Service.isIterable(status_query_list)){
            for (const x of status_query_list){
                if (types.includes(x)){ status.push(x) }
                else if (x==SIGNED && !status.includes(REQ_SIGN)){ status.push(REQ_SIGN) }
            }
        }

        if (status.length==0){ status = types }

        const raw = await agreement_db.findAll({[query_key]: email, status:status})

        // wrapping return data
        var data = []

        for (const x of raw){
            if (
                (!Util_Service.isIterable(status_query_list)) ||
                (x.status!=REQ_SIGN) ||
                (status_query_list.includes(SIGNED) && status_query_list.includes(REQ_SIGN)) ||
                (status_query_list.includes(SIGNED) && x[current_sig]!=null) ||
                (status_query_list.includes(REQ_SIGN) && x[current_sig]==null)
            ){
                    data.push(Handler.agreement_payload_handle(x, account_type))
            }
        }

        return {data: data, item_count: data.length}
    }

    //orchestrate different service to complete get_contract method 
    static async get_contract_bridge(id, email, sequelize){
        const agreement_db = new Agreement(sequelize)

        Util_Service.mandatory_field_checking({id: id})
        return await Contract_Service.get_contract(id, email, agreement_db)
    }

    //orchestrate different service to complete get_contract method 
    static async get_offer_bridge(id, email, account_type, sequelize){
        const agreement_db = new Agreement(sequelize)
        
        const payload = await Contract_Service.get_record(id, email, agreement_db)
        return Handler.agreement_payload_handle(payload, account_type)
    }

    //orchestrate different service to allowed individual account to accept an offer
    static async put_accept_bridge(offer_id, account_type, user_name, user_email, user_id, sequelize){
        const agreement_db = new Agreement(sequelize)
        Util_Service.mandatory_field_checking({id: offer_id})

        //get offer current status 
        const record = await Contract_Service.get_record(offer_id, user_email, agreement_db)
        const status = record.status

        //check account type and offer status to restrict actions 
        if (account_type!=INDIVIDUAL){
            throw new Response(400, {message: "Only for Individual account"})
        }
        if (status!=REQ_REVIEW){
            throw new Response(400, {message: "Only for offer with REQ_REVIEW status"})
        }

        const account_db = new Account(sequelize)
        const company_record = await account_db.findOne({email: record.company_email})
        const email_service = new Email_Service()

        //prepare json data
        const data = {
            details: {
                job_title: record.job_title,
                job_description: record.job_description
            },
            employee:{
                employee_id: user_id, 
                employee_name: user_name
            },
            employer:{
                employer_name: company_record.name
            },
            createdAt: currentTimeStamp,
        }
                    
        //upload data to ipfs
        const cid = await Contract_Service.add_ipfs(record.contract, data) 

        //send email to nofity
        const message = "Please check the finalized contract details on ipfs: ".concat(ipfs.gateway.concat(cid)).concat(" and sign it accordingly. <br> Note that the encrypted pdf file is the link on contract field and please use most update password to decrypt it. ")
        await email_service.send_alert(company_record.email, company_record.name, user_name, offer_id, REQ_SIGN, message)
                    
        //update status to REQ_SIGN
        const new_record = await record.update({status: REQ_SIGN, cid: cid})
        return Handler.agreement_payload_handle(new_record, account_type)
    }

    static async put_modify_bridge(
        offer_id, account_type, user_email, user_name, 
        contract_file, job_title, job_description, password, sequelize){
            
        const agreement_db = new Agreement(sequelize)
        Util_Service.mandatory_field_checking({id: offer_id})

        //get offer current status 
        const record = await Contract_Service.get_record(offer_id, user_email, agreement_db)
        const status = record.status

        //check account type and offer status to restrict actions 
        if (account_type==INDIVIDUAL && status!=REQ_REVIEW){
            throw new Response(400, {message: "Only for offer with REQ_REVIEW status"})
        }
        if (account_type==BUSINESS && status!=REQ_MODIFY){
            throw new Response(400, {message: "Only for offer with REQ_MODIFY status"})
        }

        const email_service = new Email_Service()
        const account_db = new Account(sequelize)

        // If individual account
        if(account_type==INDIVIDUAL){
            const company_record = await account_db.findOne({email: record.company_email})
    
            //update status to REQ_MODIFY
            const new_record = await record.update({status: REQ_MODIFY}) 

            //send email to notify
            await email_service.send_alert(company_record.email, company_record.name, user_name, offer_id, REQ_MODIFY, "Please modify the offer accordingly.")
            return Handler.agreement_payload_handle(new_record, account_type)
        }

        //if business account
        var query = {status: REQ_REVIEW}
        var extra_message = 'The company has made an update to the offer, please check it in our home page. '
        const candidate_record = await account_db.findOne({email: record.candidate_email})

        if (job_title){ query['job_title'] = job_title }
        if (job_description){ query['job_description'] = job_description }
        if (contract_file){
            if (!password){
                throw new Response(400, {message: "Missing password for newly upload contract"})
            }
            //encrypt pdf
            const encrypted_buffer = Contract_Service.encryption(contract_file, password)
            query['contract'] =  encrypted_buffer
            extra_message = `Company made a new update to the contract, with password:<b>${password}<b>`
        }

        //update db
        const new_record = await record.update(query) 
        
        //send email to notify
        await email_service.send_alert(candidate_record.email, candidate_record.name, user_name, offer_id, REQ_REVIEW, extra_message)
        return Handler.agreement_payload_handle(new_record, account_type)
    }

    // create signature
    static async post_sign_bridge(offer_id, secret, user_email, sequelize){
        const agreement_db = new Agreement(sequelize)
        Util_Service.mandatory_field_checking({id: offer_id, secret: secret})

        //get offer current status 
        const record = await Contract_Service.get_record(offer_id, user_email, agreement_db)

        // make signature
        const owner = new ethers.Wallet(secret)
        const message = ipfs.gateway.concat(record.cid)
        const signature =  await owner.signMessage(message)
        return {signature: signature}
    }

    // update db with users' signature, if both signed, mint nft
    static async put_sign_bridge(offer_id, account_type, user_email, user_signature, user_address, user_name, sequelize){
        const agreement_db = new Agreement(sequelize)
        Util_Service.mandatory_field_checking({id: offer_id, signature: user_signature})

        //get offer current status 
        const record = await Contract_Service.get_record(offer_id, user_email, agreement_db)
        const status = record.status
        const sig_type = (account_type==INDIVIDUAL)? "candidate_sig": "company_sig"
        const ops_sig_type = (account_type==INDIVIDUAL)? "company_sig": "candidate_sig"

        //check offer status to restrict actions 
        if (status!=REQ_SIGN){
            throw new Response(400, {message: "Only for offer with REQ_SIGN status"})
        }

        //check if signed before
        if (record[sig_type]!=null){
            throw new Response(400, {message:"Signed already"})
        }

        // check if valid sig
        const message = ipfs.gateway.concat(record.cid)

        if (!Contract_Service.verify_sig(user_address, message, user_signature)) {
            throw new Response(400, {message:"Invalid signature"})
        }

        //mint nft if both signed
        var token_id
        const account_db = new Account(sequelize)
        const ops_email = (account_type==INDIVIDUAL)? "company_email": "candidate_email"
        const ops_record = await account_db.findOne({email: record[ops_email]})

        // both signed
        if (record[ops_sig_type]!=null){
            //upload to blockchain
            if (account_type==INDIVIDUAL){
                token_id = await NFT_Service.mint_nft(message, ops_record.chain_address, user_address, record[ops_sig_type], user_signature)
            }
            if (account_type==BUSINESS){
                token_id = await NFT_Service.mint_nft(message, user_address, ops_record.chain_address, user_signature, record[ops_sig_type], )
            }
            console.log(`Minted NFT with token_id: ${token_id}`)
        }

        const update_query = (record[ops_sig_type]===null)? {[sig_type]: user_signature}: {[sig_type]: user_signature, token_id: token_id, status: COMPLETED} 
        const new_status = (record[ops_sig_type]===null)? REQ_SIGN: COMPLETED
        const extra_msg = (record[ops_sig_type]===null)? "Please sign the contract. " : `NFT is minted with id:<b>${token_id}</b> on contract(address: <b>${contractAddress}</b>)`

        //update db
        const new_record = await record.update(update_query)

        //send email to notify
        const email_service = new Email_Service()
        await email_service.send_alert(ops_record.email, ops_record.name, user_name, offer_id, new_status, extra_msg)

        return Handler.agreement_payload_handle(new_record, account_type)
    }

    static async put_reject_bridge(offer_id, user_email, user_name, account_type, sequelize){
        const agreement_db = new Agreement(sequelize)
        Util_Service.mandatory_field_checking({id: offer_id})

        //get offer current status 
        const record = await Contract_Service.get_record(offer_id, user_email, agreement_db)
        const status = record.status

        //check account type and offer status to restrict actions 
        if (status!=REQ_REVIEW && status!=REQ_SIGN && status!=REQ_MODIFY){
            throw new Response(400, {message: "Action not available"})
        }

        const email_service = new Email_Service()
        const account_db = new Account(sequelize)
        const company_record = await account_db.findOne({email: record.company_email})

        //update status to REJECTED
        const new_record = await record.update({status: REJECTED}) 

        //send email to notify
        await email_service.send_alert(company_record.email, company_record.name, user_name, offer_id, REJECTED, null)
        
        return Handler.agreement_payload_handle(new_record, account_type)
    }

    static async put_remove_bridge(offer_id, user_email, user_name, sequelize){
        const agreement_db = new Agreement(sequelize)
        Util_Service.mandatory_field_checking({id: offer_id})

        //get offer current status 
        const record = await Contract_Service.get_record(offer_id, user_email, agreement_db)
        const status = record.status

        //check account type and offer status to restrict actions 
        if (status!=REQ_REVIEW && status!=REQ_SIGN && status!=REQ_MODIFY){
            throw new Response(400, {message: "Action not available"})
        }

        const email_service = new Email_Service()
        const account_db = new Account(sequelize)
        const candidate_record = await account_db.findOne({email: record.candidate_email})

        //update status to REMOVED
        const new_record = await record.update({status: REMOVED}) 

        //send email to notify
        await email_service.send_alert(candidate_record.email, candidate_record.name, user_name, offer_id, REMOVED, null)
        
        return Handler.agreement_payload_handle(new_record, account_type)
    }

    //update NFT terminate time
    static async put_terminate_bridge(offer_id, signature, user_email, user_name, account_type, sequelize){
        const agreement_db = new Agreement(sequelize)
        Util_Service.mandatory_field_checking({id: offer_id, signature: signature})

        //get offer current status 
        const record = await Contract_Service.get_record(offer_id, user_email, agreement_db)
        const status = record.status
        const token_id = record.token_id

        //check account type and offer status to restrict actions 
        if (status!=COMPLETED){
            throw new Response(400, {message: "Action not available"})
        }

        const terminated_time = await NFT_Service.terminate_contract(token_id, signature)
        const account_db = new Account(sequelize)
        const ops_record = await account_db.findOne({email: record[(account_type==INDIVIDUAL)? "company_email": "candidate_email"]})

        const new_record = await record.update({status: TERMINATED})

        //send email to notify
        const email_service = new Email_Service()
        const extra_msg = `Terminated time is <b>${terminated_time}</b> for token <b>(token_id: ${token_id})</b>. Smart Contract address: <b>${contractAddress}</b>`
        await email_service.send_alert(ops_record.email, ops_record.name, user_name, offer_id, TERMINATED, extra_msg)

        return Handler.agreement_payload_handle(new_record, account_type)
    }

    // create signature for termination
    static async post_terminate_bridge(offer_id, secret, user_email, sequelize){
        const agreement_db = new Agreement(sequelize)
        Util_Service.mandatory_field_checking({id: offer_id, secret: secret})

        //get offer current status 
        const record = await Contract_Service.get_record(offer_id, user_email, agreement_db)

        // make signature
        const owner = new ethers.Wallet(secret)
        const message = record.token_id
        const signature =  await owner.signMessage(message)
        return {signature: signature}
    }
}

module.exports.Offer_Bridge = Offer_Bridge;