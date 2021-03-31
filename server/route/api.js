const {sendMessage} = require('../controller')

module.exports = require('express').Router()

    /*
    *   handles message sending via API
    */
    .post("/send", sendMessage)
    