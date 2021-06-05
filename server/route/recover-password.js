const {RecoverPassword} = require('../controller')

/*
*   password reset related
*/
module.exports = require('express').Router()
    .get('/step1', RecoverPassword.showStep1)
    .post('/step1', RecoverPassword.processStep1)

    .get('/step2/:token', RecoverPassword.showStep2)
    .post('/step2/:token', RecoverPassword.processStep2)
