const {DashAdminController} = require('../controller')

module.exports = require('express').Router()
    .get('/users', DashAdminController.showUsers)
    .get('/sent-messages', DashAdminController.showSentMessages)
