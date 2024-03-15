const {contractAddress, alchemy_api} = require("../config.js")
const { Alchemy, Network } = require("alchemy-sdk")

class Alchemy_Service{
    static #config = {
        apiKey: alchemy_api.API_KEY,
        network: Network.MATIC_MUMBAI,
    }

    static async get_nft(address){
        const alchemy = new Alchemy(this.#config);
        const result = await alchemy.nft.getNftsForOwner(address, {contractAddresses:[contractAddress]});
        return result.ownedNfts
    }
}

module.exports.Alchemy_Service = Alchemy_Service