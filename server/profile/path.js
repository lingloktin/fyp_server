const {Profile_View} = require("./profile_view.js")

function path(app, sequelize){ 
    const profile_view = new Profile_View()

    // add the path here
    app.post('/profile', async (req,res) => {await profile_view.post_profile_view(req, res)})
    app.get('/profile/record', async (req,res) => {await profile_view.get_record_view(req, res)})
}

module.exports.path = path