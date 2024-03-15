module.exports = {
  secret: "secret-for-signing-jwt",

  currentTimeStamp: Date.now()/1000, //current time stamp in seconds

  account_type: {
    INDIVIDUAL: "INDIVIDUAL", 
    BUSINESS:"BUSINESS"
  },

  agreement_status: {
    REQ_REVIEW:"REQ_REVIEW", 
    REQ_SIGN:"REQ_SIGN", 
    COMPLETED:"COMPLETED", 
    TERMINATED:"TERMINATED",
    REJECTED: 'REJECTED',
    REMOVED: 'REMOVED',
    REQ_MODIFY: 'REQ_MODIFY',
    SIGNED : 'SIGNED',
  },

  email:{
    address:"fyp22041@gmail.com",
    password:"qxixahjftmuxgavi"
    // password:"hku20222023#"
  },

  pg:{
    database:"fyp@fyp-20222023",
    password:"hku20222023#"
  },

  ipfs:{
    projectID: '2G1in0Z15ROkMxLodoArwiD7WD0',
    secret: '2903d51e24990c5716486712e04993be',
    gateway: 'https://fyp22041.infura-ipfs.io/ipfs/'
  },

  agreement_action:{
    ACCEPT: 'ACCEPT',
    SIGN: 'SIGN',
    MODIFY: 'MODIFY',
    REJECT: 'REJECT',
    TERMINATE: 'TERMINATE',
    REMOVE: 'REMOVE'
  },

  alchemy_api:{
    API_URL: "https://polygon-mumbai.g.alchemy.com/v2/LJXPgX1nx4W9NzbLHtwxXKDLirC8VBKU",
    API_KEY: "LJXPgX1nx4W9NzbLHtwxXKDLirC8VBKU"
  },

  contractAddress: "0xE562669590E6C9e4dab295208EBDb74935e194A2",

  owner:{
    address: "0xA592B0bA5967301a0Bd0BC2A5B8d6b0b751F8561",
    PRIVATE_KEY: "4412fc36220a7a939b26bf3a035491c8030f437f63097b6f6f6ef14dd3b53cf5"
  }
}
