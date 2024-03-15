const {Handler} = require("../util/handler.js")
const {Profile_Bridge} = require("../profile/profile_bridge.js")

class Profile_View {
    constructor(sequelize) {
        this.sequelize = sequelize;
    }

    //get profile
    async post_profile_view(req, res){      
        //handle return value of the bridge and wrap it to the response obj
        try{
            //unwrap the req body params and delegate them to create_account_bridge
            const payload = await Profile_Bridge.post_profile_bridge(req.body.id, req.body.chain_address)
            return res.status(201).json(payload) 
        }
        catch(err){
            return Handler.error_handle(res, err)
        }        
    }

    //read nft record
    async get_record_view(req, res){      
        //handle return value of the bridge and wrap it to the response obj
        try{
            //unwrap the req body params and delegate them to create_account_bridge
            const payload = await Profile_Bridge.get_record_bridge(req.query.token_id)
            return res.status(200).json(payload) 
        }
        catch(err){
            return Handler.error_handle(res, err)
        }        
    }
}

module.exports.Profile_View = Profile_View;