const {DashController, AuthController} = require('../controller')
const {mustBeAdmin, validateSchema} = require('../middleware')
const { OpenTicketSchema, SendTicketMessage } = require('../schemas')

/*
*   handles dashboard related operations
*/
module.exports = require('express').Router()
    .get('/', DashController.showFront)

    // account related
    .get('/logout', AuthController.logout)
    .get('/regenerate-api', DashController.regenerateAPI)
    .post('/change-password', DashController.changePassword)
    
    .get('/account-information', DashController.showAccountInformation)
    .get('/send-demo-sms', DashController.showDemoSMS)
    .get('/api-reference', DashController.showApiReference)

    .post('/del-account', DashController.delAccount)
    //

    // Tickets related
    .get('/tickets', DashController.getMyTickets)
    .get('/tickets/:ticket_id([0-9]+)', DashController.getTicketData)
    .get('/tickets/:ticket_id([0-9]+)/swap/:state([0-1]{1})', DashController.swapTicketState)
    .post('/tickets', validateSchema(OpenTicketSchema), DashController.openTicket)
    .post('/tickets/:ticket_id([0-9]+)/message', validateSchema(SendTicketMessage), DashController.sendTicketMessage)
    //

    .use('/admin', mustBeAdmin, require('./dash-admin'))

