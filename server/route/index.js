const Bodyparser = require('body-parser')


module.exports = require('express').Router()
    .use("/", Bodyparser.urlencoded(), require('./site'))
    .use("/api", Bodyparser.json(), require('./api'))
