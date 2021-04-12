const {DashController, AuthController} = require('../controller')
const {mustBeAdmin} = require('../middleware')

/*
*   handles dashboard related operations
*/
module.exports = require('express').Router()
    .get('/', DashController.showFront)
    .get('/logout', AuthController.logout)
    .get('/regenerate-api', DashController.regenerateAPI)
    .post('/change-password', DashController.changePassword)
    

    .get('/account-information', DashController.showAccountInformation)
    .get('/send-demo-sms', DashController.showDemoSMS)
    .get('/api-reference', DashController.showApiReference)

    .use('/admin', mustBeAdmin, require('./dash-admin'))

