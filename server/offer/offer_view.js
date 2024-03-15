const {Offer_Bridge} = require("./offer_bridge.js")
const {Handler} = require("../util/handler.js")
const {Response} = require("../util/response.js")

class Offer_View {
    constructor(sequelize) {
        this.sequelize = sequelize;
    }

    // upload contract and relevant details
    async post(req,res){
        try{
            //multer middleware, for file type checking
            if (req.file===undefined || req.file.mimetype!='application/pdf'){
                throw new Response(400, {message:"Invalid file format, please attach contract in pdf format"})
            }

            //delegate params to post_bridge
            const payload = await Offer_Bridge.post_bridge(
                req.body.job_title, req.body.candidate_email, req.user.email, req.user.name, 
                req.file.originalname, req.file.buffer, req.body.password, req.body.job_description, this.sequelize)
            return res.status(200).json(payload)
        }
        catch(err){
            console.log(err)
            return Handler.error_handle(res, err)
        }   
    }

    // get all sent/received offer
    async get(req, res){
        try{
            if (String(req.query.status)===req.query.status){ req.query.status = [req.query.status]}
            const payload = await Offer_Bridge.get_bridge(req.user.email, req.user.type, req.query.status, this.sequelize)
            return res.status(200).json(payload)
        }
        catch(err){
            console.log(err)
            return Handler.error_handle(res, err)
        }   
    }

    // get contract of specific offer
    async get_contract_view(req,res){
        try{
            const payload = await Offer_Bridge.get_contract_bridge(req.query.id, req.user.email, this.sequelize)
            res.set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': req.query.id
            });
            return res.status(200).send(payload)
        }
        catch(err){
            console.log(err)
            return Handler.error_handle(res, err)
        }   
    }

    //get offer status
    async get_offer_view(req,res){
        try{
            const payload = await Offer_Bridge.get_offer_bridge(req.params.id, req.user.email, req.user.type, this.sequelize)
            return res.status(200).json(payload)
        }
        catch(err){
            console.log(err)
            return Handler.error_handle(res, err)
        }   
    }

    //update offer status to accept
    async put_accept_view(req,res){
        try{
            const payload = await Offer_Bridge.put_accept_bridge(req.body.id, req.user.type, req.user.name, req.user.email, req.user.id, this.sequelize)
            return res.status(200).json(payload)
        }
        catch(err){
            console.log(err)
            return Handler.error_handle(res, err)
        }   
    }

    // INDIVIDUAL account: update offer status to request modify
    // BUSINESS account: update offer details
    async put_modify_view(req,res){
        try{
            var file_buffer=null
            if (req.file){
                //multer middleware, for file type checking
                if (req.file.mimetype!='application/pdf'){
                    throw new Response(400, {message:"Invalid file format, please attach contract in pdf format"})
                }
                file_buffer=req.file.buffer
            }
            const payload = await Offer_Bridge.put_modify_bridge(
                req.body.id, req.user.type, req.user.email, req.user.name, file_buffer, 
                req.body.job_title, req.body.job_description, req.body.password, this.sequelize)
            return res.status(200).json(payload)
        }
        catch(err){
            console.log(err)
            return Handler.error_handle(res, err)
        }   
    }

    //get signature for put_sign
    async post_sign_view(req, res){
        try{
            const payload = await Offer_Bridge.post_sign_bridge(req.body.id, req.body.secret, req.user.email, this.sequelize)
            return res.status(200).json(payload)
        }
        catch(err){
            console.log(err)
            return Handler.error_handle(res, err)
        }   
    }

    //update offer status to sign and mint as NFT
    async put_sign_view(req,res){
        try{
            const payload = await Offer_Bridge.put_sign_bridge(req.body.id, req.user.type, req.user.email, req.body.signature, req.user.chain_address, req.user.name, this.sequelize)
            return res.status(200).json(payload)
        }
        catch(err){
            console.log(err)
            return Handler.error_handle(res, err)
        }   
    }

    //update offer status to reject
    async put_reject_view(req,res){
        try{
            const payload = await Offer_Bridge.put_reject_bridge(req.body.id, req.user.email, req.user.name, req.user.type, this.sequelize)
            return res.status(200).json(payload)
        }
        catch(err){
            console.log(err)
            return Handler.error_handle(res, err)
        }   
    }

    //update offer status to remove
    async put_remove_view(req,res){
        try{
            const payload = await Offer_Bridge.put_remove_bridge(req.body.id, req.user.email, req.user.name, req.user.type, this.sequelize)
            return res.status(200).json(payload)
        }
        catch(err){
            console.log(err)
            return Handler.error_handle(res, err)
        }   
    }

    //update offer status to reject
    async put_terminate_view(req,res){
        try{
            const payload = await Offer_Bridge.put_terminate_bridge(req.body.id, req.body.signature, req.user.email, req.user.name, req.user.type,  this.sequelize)
            return res.status(200).json(payload)
        }
        catch(err){
            console.log(err)
            return Handler.error_handle(res, err)
        }   
    }
    
    //get signature for put termiante
    async post_terminate_view(req, res){
        try{
            const payload = await Offer_Bridge.post_terminate_bridge(req.body.id, req.body.secret, req.user.email, this.sequelize)
            return res.status(200).json(payload)
        }
        catch(err){
            console.log(err)
            return Handler.error_handle(res, err)
        }   
    }
}

module.exports.Offer_View = Offer_View;