const {Account_Bridge} = require("./account_bridge.js")
const {Handler} = require("../util/handler.js")

class Account_View {
    constructor(sequelize) {
        this.sequelize = sequelize;
    }

    // get id method
    async get(req,res){
        const account_bridge = new Account_Bridge()
        try{
            const payload = await account_bridge.get_account_bridge(req.params.email, req.body.id, this.sequelize);
            return res.status(200).json(payload)     
        }
        catch(err){
            return Handler.error_handle(res, err)
        }
    }

    //create account
    async create(req, res){
        const account_bridge = new Account_Bridge()
        
        //delegate params to create_account_bridge
        try{
            const payload = await account_bridge.create_account_bridge(req.body.email, req.body.password, req.body.name, req.body.chain_address, req.body.type, req.body.id, this.sequelize);
            return res.status(200).json(payload) 
        }
        catch(err){
            return Handler.error_handle(res, err)
        }        
    }

    //login account
    async login(req, res){
        const account_bridge = new Account_Bridge()
        
        //handle return value of the bridge and wrap it to the response obj
        try{
            //unwrap the req body params and delegate them to create_account_bridge
            const payload = await account_bridge.login_bridge(req.body.email, req.body.password, this.sequelize)
            return res.status(201).json(payload) 
        }
        catch(err){
            return Handler.error_handle(res, err)
        }        
    }
}

module.exports.Account_View = Account_View;