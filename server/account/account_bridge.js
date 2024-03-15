const {Account} = require("../model/account.js")
const {Account_Service} = require("../service/account_service.js")
const {Util_Service} = require("../service/util_service.js")
const bcrypt = require("bcrypt")
const {Response} = require("../util/response.js")

class Account_Bridge {
    // get account id
    async get_account_bridge(email, id, sequelize){
        console.log(email)
        console.log(id)
        const account_db = new Account(sequelize);
        //check if exists in company account
        // const salt = 10
        // const id_hash = ((id===undefined || id===null)? null : await bcrypt.hash(id, salt))

        const payload = await account_db.findOne({email: email})
        if (payload===null){
            throw new Response(404, {message: "User does not exists"})
        }
        if (!await bcrypt.compare(id, payload.id)){
            throw new Response(401, {message: "Incorret id"})
        }
        return {chain_address: payload.chain_address}
    }

    //account creation
    async create_account_bridge(email, password, name, chain_address, type, id, sequelize){
        const account_db = new Account(sequelize);
        Util_Service.mandatory_field_checking({email:email, password:password, name:name, chain_address:chain_address, type:type})
        await Account_Service.verification(email, type, id, account_db) //verify data

        return await Account_Service.account_creation(email, password, name, chain_address, type, id, account_db) //create if passed the verification
    }

    //login
    async login_bridge(email, password, sequelize){
        const account_db = new Account(sequelize);
        Util_Service.mandatory_field_checking({email:email, password:password})

        return await Account_Service.account_authentication(email, password, account_db) // delegate params to auth service
    }
}

module.exports.Account_Bridge = Account_Bridge;