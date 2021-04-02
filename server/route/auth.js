const {Auth} = require('../controller')

/*
*   authentication related
*/
module.exports = require('express').Router()
    .get('/login', Auth.loginForm)
    .post('/login', Auth.login)
    .get('/register', Auth.regForm)
    .post('/register', Auth.register)
    