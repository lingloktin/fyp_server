const {Response} = require("../util/response.js")
const { agreement_status, account_type } = require("../config.js")

const REQ_SIGN = agreement_status.REQ_SIGN
const SIGNED = agreement_status.SIGNED
const INDIVIDUAL = account_type.INDIVIDUAL
const BUSINESS = account_type.BUSINESS

class Handler{
    static error_handle(res, error){
        if (error instanceof Response){
            return res.status(error.get_status()).json(error.get_payload())
        }
        
        //default error response
        console.log(error)
        return res.status(404).json({message:"Error occur, please try again later"})
    }

    static agreement_payload_handle(payload, account_type){
        const current_sig = (account_type==INDIVIDUAL)? "candidate_sig": "company_sig"

        if (payload!=null && payload!=undefined){
            return {
                id: payload.id,
                cid: payload.cid, 
                job_title: payload.job_title,
                job_description: payload.job_description,
                company_email: payload.company_email,
                candidate_email: payload.candidate_email,
                status: (payload.status==REQ_SIGN && payload[current_sig]!=null)? SIGNED: payload.status,
                updatedAt: payload.updatedAt,
                createdAt: payload.createdAt,
                token_id: (payload.token_id)? payload.token_id: undefined
            }
        }
        return {}
    }
}
module.exports.Handler = Handler;