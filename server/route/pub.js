const Path = require('path')

module.exports = require('express').Router()
    /*
    *   for public files
    */
    .get('/:target(*)', (req, res, next)=>{
       
        let p = Path.resolve(`${__dirname}/../pub/${req.params.target}`)
        res.setHeader("Cache-Control", `max-age=${60*15}, must-revalidate`)
        res.sendFile(p, function(e){
            next(e)
        })
    })
