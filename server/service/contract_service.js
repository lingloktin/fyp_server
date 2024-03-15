const muhammara = require("muhammara")
const {ipfs} = require("../config.js")
const ipfsClient = require("ipfs-http-client")
const {ethers} = require("ethers")
const {hashMessage} = require("@ethersproject/hash");
const {Response} = require("../util/response.js")

class Contract_Service{
    static encryption(file_buffer, password){
        try {
            const readStream = new muhammara.PDFRStreamForBuffer(file_buffer);
            const writeStream = new muhammara.PDFWStreamForBuffer();
            muhammara.recrypt(readStream ,writeStream, {
                userPassword: password, // required
                ownerPassword: password, // optional
            });
            return writeStream.buffer;
        } catch (error) {
            throw new Error("encryption error")
        }
    }

    static async get_contract(id, email, agreement_db){
        const payload = await agreement_db.findOne(id)

        // record not found
        if (!payload){
            throw new Response(404, {message:"Invalid id"})
        }

        // check access right
        if (payload.company_email!=email && payload.candidate_email!=email){
            throw new Response(400, {message:"No access right to the document"})
        }

        return payload.contract
    }
    
    static async get_record(id, email, agreement_db){
        const payload = await agreement_db.findOne(id)

        // record not found
        if (!payload){
            throw new Response(404, {message:"Invalid id"})
        }

        // check access right
        if (payload.company_email!=email && payload.candidate_email!=email){
            throw new Response(400, {message:"No access right"})
        }

        return payload
    }

    static async add_ipfs(file_buffer, json_data){
        const auth = 'Basic ' + Buffer.from(ipfs.projectID + ':' + ipfs.secret).toString('base64');
        const client = ipfsClient.create({
            host: 'ipfs.infura.io',
            port: 5001,
            protocol: 'https',
            apiPath: '/api/v0',
            headers: {
                authorization: auth,
            }
        })

        //upload contract document to ipfs
        const doc = await client.add(file_buffer)
        json_data['contract'] = ipfs.gateway.concat(doc.path)

        const res = await client.add(JSON.stringify(json_data))     //upload nft meta data to 

        return res.path  //return cid
    }

    static verify_sig(address, message, signature){
        //return true if signature is signed by the address owner on message
        return ethers.utils.recoverAddress(hashMessage(message), signature).toLowerCase() == address.toLowerCase()
    }
}

module.exports.Contract_Service = Contract_Service;