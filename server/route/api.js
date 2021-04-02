const {sendMessage, ApiController} = require('../controller')
const { checkApiToken} = require('../middleware')

module.exports = require('express').Router()

    /*
    *   handles message sending via API
    */
    .post("/send", sendMessage)

    
    .post('/send/:key([a-z0-9]+)', checkApiToken, ApiController.sendByToken)
