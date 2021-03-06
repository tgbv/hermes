const {DashAdminController} = require('../controller')

module.exports = require('express').Router()
    .get('/users', DashAdminController.showUsers)
    .get('/users/:user_id/ban-swap', DashAdminController.swapBanState)
    .get('/sent-messages', DashAdminController.showSentMessages)
    .get('/tickets', DashAdminController.getTickets)
    .post('/del-user/:user_id', DashAdminController.delAccount)
