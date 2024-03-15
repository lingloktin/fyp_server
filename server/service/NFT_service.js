const {ethers} = require("ethers")
const {contractAddress, alchemy_api, owner} = require("../config.js")
const FypToken = require("../../smart_contract/artifacts/smart_contract/contracts/fyp_token.sol/FypToken.json")
const {Response} = require("../util/response.js")
const { default: axios } = require("axios")
const API_KEY = alchemy_api.API_KEY

class NFT_Service{
    static #provider = new ethers.providers.AlchemyProvider('maticmum', API_KEY) ; //add the uri as param if other network is being used
    static #signer = new ethers.Wallet(owner.PRIVATE_KEY, this.#provider)
    static #contract = new ethers.Contract(contractAddress, FypToken.abi, this.#signer)

    static async mint_nft(message, company_adress, candidate_address, company_sig, candidate_sig){
        try{
            company_sig = ethers.utils.splitSignature(company_sig)
            candidate_sig = ethers.utils.splitSignature(candidate_sig)
            const mint = await this.#contract.mint(message, company_adress, company_sig.v, company_sig.r, company_sig.s, 
                candidate_address, candidate_sig.v, candidate_sig.r, candidate_sig.s)
            const rc = await mint.wait(); 
            const event = rc.events.find(event => event.event === 'return_uint256');
            const [value] = event.args;
            if (value.toNumber()==0){ throw new Error("Fail to mint NFT")}
            return value.toNumber(); 
        }
        catch(err) {
            console.log(err)
            throw new Response(500, {message:"Fail to mint NFT, please contact us."})
        }
    }

    static async get_metadata(token_id){
        try{
            const uri = await this.#contract.tokenURI(token_id)
            const payload = await axios.get(uri);
            const terminate_time = await this.#contract.terminate_time(token_id)
            return {
                ...payload.data,
                termintated: !Number(terminate_time.toString())==0,
                terminated_at: (Number(terminate_time.toString())==0)? null: Number(terminate_time.toString())
            }
        }
        catch(err){
            console.log(err)
            throw new Response(500, {message:"Invalid Token ID"})
        }
    }

    static async terminate_contract(token_id, signature){
        try{
            signature = ethers.utils.splitSignature(signature)
            const res =  await this.#contract.terminate(token_id, signature.v, signature.r, signature.s)
            const rc = await res.wait(); 
            const event = rc.events.find(event => event.event === 'return_uint256');
            const [value] = event.args;
            if (value.toNumber()==0){ throw new Error("Fail to terminate NFT")}
            return value.toNumber(); 
        }
        catch(err){
            console.log(err)
            throw new Response(500, {message:"Fail to terminate the NFT or it is terminated, please check it."})
        }
    }
}

module.exports.NFT_Service = NFT_Service;