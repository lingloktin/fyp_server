const multer = require("multer")
const {Middleware} = require("../middleware.js")
const {Offer_View} = require("./offer_view.js")

const form_handler = multer({
    storage: multer.memoryStorage(), 
    limits:{ fileSize: 3145728}, //3MB
})

function path(app, sequelize){ 
    const offer_view = new Offer_View(sequelize)

    // add the path here
    app.post('/offer', 
        Middleware.buinsess_account_authentication, //middleware for authentication (only for business account)
        form_handler.single("contract"), //middleware to handle file upload
        async (req,res) => {await offer_view.post(req, res)}
    );
    app.get('/offer', Middleware.authentication, async (req,res) => {await offer_view.get(req, res)})
    app.get('/offer/specific/:id', Middleware.authentication, async (req,res) => {await offer_view.get_offer_view(req, res)})
    app.get('/offer/contract', Middleware.authentication, async (req,res) => {await offer_view.get_contract_view(req, res)})
    app.put('/offer/accept', Middleware.individual_account_authentication, async (req,res) => {await offer_view.put_accept_view(req, res)})
    app.put('/offer/modify', 
        Middleware.authentication, 
        form_handler.single("contract"), //middleware to handle file upload
        async (req,res) => {await offer_view.put_modify_view(req, res)}
    )
    app.post('/offer/sign', Middleware.authentication, async (req,res) => {await offer_view.post_sign_view(req, res)})
    app.put('/offer/sign', Middleware.authentication, async (req,res) => {await offer_view.put_sign_view(req, res)})
    app.put('/offer/reject', Middleware.individual_account_authentication, async (req,res) => {await offer_view.put_reject_view(req, res)})
    app.put('/offer/remove', Middleware.buinsess_account_authentication, async (req,res) => {await offer_view.put_remove_view(req, res)})
    app.put('/offer/terminate', Middleware.authentication, async (req,res) => {await offer_view.put_terminate_view(req, res)})
    app.post('/offer/terminate', Middleware.authentication, async (req,res) => {await offer_view.post_terminate_view(req, res)})
}

module.exports.path = path