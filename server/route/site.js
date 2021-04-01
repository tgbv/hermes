const {t} = require('../util')
const Fs = require('fs')
const Path = require('path')

const {Auth} = require('../controller')

module.exports = require('express').Router()

    /*
    *   for homepage
    */
    .get('/', (req, res, next)=>{
        res.send(t('home'))
    })

    /*
    *   authentication related
    */
    .get('/login', Auth.loginForm)
    .post('/login', Auth.login)
    .get('/register', Auth.regForm)
    .post('/register', Auth.register)
    
    
    
    /*
    *   for public files
    */
    .get('/pub/:target*', (req, res, next)=>{
        let p = Path.resolve(`${__dirname}/../pub/${req.params.target}`)
        res.sendFile(p, function(e){
            next(e)
        })
    })


    