const {Account} = require("../model/account.js")
const {Util_Service} = require("../service/util_service.js")
const {Alchemy_Service} = require("../service/alchemy_service.js")
const {Profile_Service} = require("../service/profile_service.js")
const {NFT_Service} = require("../service/NFT_service.js")

class Profile_Bridge {
    
    //get job record of a particular account
    static async post_profile_bridge(official_id, chain_address){
        Util_Service.mandatory_field_checking({id:official_id, chain_address:chain_address})

        const owned_nft = await Alchemy_Service.get_nft(chain_address)

        return await Profile_Service.verification(owned_nft, official_id)
    }

    static async get_record_bridge(token_id){
        Util_Service.mandatory_field_checking({token_id:token_id})

        return await NFT_Service.get_metadata(token_id)
    }
}

module.exports.Profile_Bridge = Profile_Bridge;