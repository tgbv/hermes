const {t} = require('../util')
const Fs = require('fs')
const Path = require('path')

module.exports = require('express').Router()

    /*
    *   for homepage
    */
    .get('/', (req, res, next)=>{
        res.send(t('home'))
    })
    
    /*
    *   for public files
    */
    .get('/pub/:target*', (req, res, next)=>{
        let p = Path.resolve(`${__dirname}/../pub/${req.params.target}`)
        res.sendFile(p, function(e){
            next(e)
        })
    })
    