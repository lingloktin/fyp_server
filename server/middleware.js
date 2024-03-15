const { Account } = require("./model/account.js");
const {Account_Service} = require("./service/account_service.js")
const {Handler} = require("./util/handler.js")

class Middleware{
    static async authentication(req, res, next){
        const token = req.headers["x-access-token"];
        try{
            req.user = await Account_Service.token_authentication(token)
            next()
        }
        catch(err){
            console.log(err)
            Handler.error_handle(res, err)
        }
    }

    static async buinsess_account_authentication(req, res, next){
        const token = req.headers["x-access-token"];
        try{
            req.user = await Account_Service.token_authentication(token)
            Account_Service.business_account_only(req.user.type)
            next()
        }
        catch(err){
            console.log(err)
            Handler.error_handle(res, err)
        }
    }

    static async individual_account_authentication(req, res, next){
        const token = req.headers["x-access-token"];
        try{
            req.user = await Account_Service.token_authentication(token)
            Account_Service.individual_account_only(req.user.type)
            next()
        }
        catch(err){
            console.log(err)
            Handler.error_handle(res, err)
        }
    }
}

module.exports.Middleware = Middleware;