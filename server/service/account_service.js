const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const {secret, currentTimeStamp, account_type} = require("../config.js")
const {Response} = require("../util/response.js")

class Account_Service {
    static async verification(email, type, id, account_db){
        // validate email 
        const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

        if (!email.match(regex)){
            throw new Response(404, {message: "Invalid pattern of email"})
        }

        //check if email already used
        const email_exist = await account_db.findOne({email: email})
        if (email_exist){
            throw new Response(404, {message: "Account with same email exist"})
        }

        //check if correct type
        if (type!=account_type.BUSINESS && type!= account_type.INDIVIDUAL){
            throw new Response(404, {message: "Incorrect Account Type"})
        }

        //check if missing hkid for CANDIDATE account
        if (type==account_type.INDIVIDUAL && (id===null || id ===undefined)){
            throw new Response(404, {message: "Missing id number"})
        }
    }

    static async account_creation(email, password, name, chain_address, type, id, account_db){
        //hash password
        const salt = 10
        try{
            const password_hash = await bcrypt.hash(password, salt)
            const id_hash = ((id===undefined || id===null)? null : await bcrypt.hash(id, salt))
            const res = await account_db.create(email, password_hash, name, chain_address, type, id_hash)
            if (res){
                const data = {
                    email: res.dataValues.email,
                    id: res.dataValues.id, 
                    type: res.dataValues.type,
                    name: res.dataValues.name,
                    chain_address: res.dataValues.chain_address
                }

                //create token
                const token = jwt.sign({user:data}, secret, {expiresIn: "8h"})
                return {
                    email: res.dataValues.email,
                    name: res.dataValues.name,
                    chain_address: res.dataValues.chain_address,
                    type: res.dataValues.type,
                    createdAt: res.dataValues.createdAt,
                    accessToken: token
                }
            }
            else{
                throw new Error()
            }
        }
        catch(err){
            throw new Response(404, {message: "Error occured, please try again"})
        }
    }

    static async account_authentication(email, password, account_db){
        //check if email exist
        const account = await account_db.findOne({email: email})
        if (account===null){
            throw new Response(404, {message: "Account does not exist"})
        }

        //check if password match
        if (!await bcrypt.compare(password, account.password)){
            throw new Response(401, {message: "Incorrect password"})
        }

        const data = {
            email: account.dataValues.email,
            id: account.dataValues.id, 
            type: account.dataValues.type,
            name: account.dataValues.name,
            chain_address: account.dataValues.chain_address
        }

        //create token
        const token = jwt.sign({user: data}, secret, {expiresIn: "8h"})

        var data_copy = {...data}
        delete data_copy.id
        const res = {
            ...data_copy,
            accessToken: token,
            updatedAt:account.dataValues.updatedAt
        }

        return res
    }

    static async token_authentication(token){
        // check if token presented
        if (token===undefined || token===null){
            throw new Response(403, {message: "Please login, and provide token to the header"})
        }

        try{
            const decoded =  jwt.verify(token, secret)
            return decoded.user
        }
        catch(err){
            if (err.message=='jwt expired'){ throw new Response(401, {message: "Token Expired"}) }
            else{ throw new Response(401, {message: "Unauthorized"}) }
        }
    }

    static business_account_only(type){
        if (type!=account_type.BUSINESS){
            throw new Response(401, {message: "Unauthorized"})
        }
    }

    static individual_account_only(type){
        if (type!=account_type.INDIVIDUAL){
            throw new Response(401, {message: "Unauthorized"})
        }
    }
}

module.exports.Account_Service = Account_Service;