const { Sequelize } = require('sequelize');

const {Account} = require("./model/account.js")
const {Agreement} = require("./model/agreement.js")
const {Blob} = require("buffer")
const {Buffer} = require("buffer")
const fs = require("fs")
const {Util_Service} = require("./service/util_service.js")
const {Offer_Bridge} = require("./offer/offer_bridge.js")
const axios = require("axios")
const sequelize = new Sequelize('postgres', 'fyp@fyp-20222023', 'hku20222023#', {
    host: 'localhost',
    dialect: 'postgres',
});

const account = new Account(sequelize);
const agreement = new Agreement(sequelize);

sequelize.sync().then(() => {
    account.create('demo@gmail.com', '1234', 'demo_name', 'sampleaddress', 'BUSINESS', null)
    account.create('sdfsdfsdfsdf@gmail.com', '1234', 'demo_name', 'sampleaddress', 'INDIVIDUAL', "dfsdfdsfs")
    agreement.create('job_title', 'candidate_email', 'company_email', new Blob(Buffer.from([])), "REQ_REVIEW", null)
  });