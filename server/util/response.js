class Response{
    #status
    #payload

    constructor(status, payload){
        this.#status = status
        this.#payload = payload
    }

    get_status(){
        return this.#status
    }

    get_payload(){
        return this.#payload
    }
}

module.exports.Response = Response;