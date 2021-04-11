const { ApiController} = require('../controller')
const { checkApiToken, checkApiThrottle, validateSchema} = require('../middleware')
const { apiSendSMS } = require('../schemas')

module.exports = require('express').Router()

    /*
    *   handles message sending via API
    */
    .post('/send/:key([a-z0-9]+)', validateSchema(apiSendSMS), checkApiToken, checkApiThrottle, ApiController.sendByToken)
