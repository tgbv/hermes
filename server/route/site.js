const {t} = require('../util')
const Fs = require('fs')
const Path = require('path')

const {isLoggedIn} = require('../middleware')

module.exports = require('express').Router()

    /*
    *   for homepage
    */
    .get('/', isLoggedIn, (req, res, next)=>{
        res.send(t('home'))
    })
    


    