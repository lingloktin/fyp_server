const {Account_View} = require('./account_view.js')

function path(app, sequelize){ 
    const account_view = new Account_View(sequelize)
    
    // add the path here
    app.post('/account/login',  async (req,res) => {await account_view.login(req,res)});
    app.post('/account/create', async (req,res) => {await account_view.create(req,res)});
    app.get('/account/:email', async (req,res) => {await account_view.get(req,res)});
}

module.exports.path = path