module.exports = require('express').Router()
    .use("/", require('./site'))
    .use("/api", require('./api'))
