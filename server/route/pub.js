const Path = require('path')

module.exports = require('express').Router()
    /*
    *   for public files
    */
    .get('/:target*', (req, res, next)=>{
       
        let p = Path.resolve(`${__dirname}/../pub/${req.params.target}`)
        res.sendFile(p, function(e){
            next(e)
        })
    })
