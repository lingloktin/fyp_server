const {Response} = require("../util/response.js")

class Util_Service{

    //check if all mandatory field exist
    static mandatory_field_checking(params_dict){
        var missing_list = []

        //loop through entire list and push to missing_list if the param is missing
        for (const param in params_dict){
            if (params_dict[param]===null || params_dict[param]===undefined || params_dict[param]===""){
                missing_list.push(param)
            }
        }
        
        //if there are missing params, add to error message
        if (missing_list.length!=0){
            var error_message = "Missing Mandatory Field of "
            for (const param of missing_list){
                error_message = error_message.concat(", ",param)
            }
            throw  new Response(400, {message: error_message})
        }
        
    }

    static isIterable(x){
        return !!x?.[Symbol.iterator]
    }
}

module.exports.Util_Service = Util_Service;