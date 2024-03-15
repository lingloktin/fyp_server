const axios = require('axios');
const bcrypt = require("bcrypt");
const { record } = require('fp-ts');

class Profile_Service{
    static async verification(owned_nft, user_id){
        //hash id
        const salt = 10
        var payload = []
        var invalid_count = 0

        for (const record of owned_nft){
            const metadata = record.rawMetadata
            var valid = true
            if (!await bcrypt.compare(user_id, metadata.employee.employee_id)){
                valid = false
                invalid_count+=1
            }

            const data={
                tokenId: record.tokenId,
                valid: valid,
                metadata: record.rawMetadata
            }

            payload.push(data)
        }

        return {payload:payload, invalid_count: invalid_count, total:owned_nft.length}
    }
}

module.exports.Profile_Service = Profile_Service;