const Bodyparser = require('body-parser')
const {session} = require('../util')
const {isLoggedIn, mustBeLoggedIn} = require('../middleware')

module.exports = require('express').Router()

    /*
    *   api related
    */
    .use("/api", Bodyparser.json(), require('./api'))

    /**
     * auth related
     */
    .use('/auth', Bodyparser.urlencoded(), session, isLoggedIn, require('./auth'))

    /*
    *   dash related
    */
    .use('/dash', session, mustBeLoggedIn, require('./dash'))

    /*
    *   storage related
    */
    .use("/pub", Bodyparser.urlencoded(), require('./pub'))

    /*
    *   site related
    */
    .use("/", session, Bodyparser.urlencoded(), require('./site'))
    
