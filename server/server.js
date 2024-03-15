// import Candidate_Account from "";
const express = require('express');
const { Sequelize } = require('sequelize');
const account = require('./account/path.js')
const offer = require('./offer/path.js')
const profile = require('./profile/path.js')
const {pg} = require("./config.js")
const cors = require('cors')

const app = express();
const port = 8000;
const sequelize = new Sequelize('postgres', pg.database, pg.password, {
    host: 'localhost',
    dialect: 'postgres',
});

app.use((req, res, next) => {
    console.log('new request made:');
    console.log('host: ', req.hostname);
    console.log('path: ', req.path);
    console.log('method: ', req.method);
    next();
  });

app.use(express.json())
app.use(cors());

//all uri path
account.path(app, sequelize); // /acount/
offer.path(app, sequelize)// /offer/
profile.path(app, sequelize)// /profile/

// listen for requests
app.listen(port);