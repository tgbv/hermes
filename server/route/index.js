const Bodyparser = require('body-parser')
const {session} = require('../util')
const {isLoggedIn, mustBeLoggedIn, setDefaultSessionData, mustBeAdmin} = require('../middleware')

module.exports = require('express').Router()

    /*
    *   api related
    */
    .use("/api", Bodyparser.json(), require('./api'))

    /**
     * auth related
     */
    .use('/auth', Bodyparser.urlencoded(), session, setDefaultSessionData, isLoggedIn, require('./auth'))

    /*
    *   dash related
    */
    .use('/dash', Bodyparser.urlencoded(), session, setDefaultSessionData, mustBeLoggedIn, require('./dash'))
    .use('/dash/admin', Bodyparser.urlencoded(), session, setDefaultSessionData, mustBeLoggedIn, mustBeAdmin, require('./dash-admin'))

    /*
    *   storage related
    */
    .use("/pub", Bodyparser.urlencoded(), require('./pub'))

    /*
    *   site related
    */
    .use("/", Bodyparser.urlencoded(), session, setDefaultSessionData, require('./site'))
    
