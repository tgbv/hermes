const {DashController, AuthController} = require('../controller')
/*
*   handles dashboard related operations
*/
module.exports = require('express').Router()
    .get('/', DashController.showFront)
    .get('/logout', AuthController.logout)
    .get('/regenerate-api', DashController.regenerateAPI)
    