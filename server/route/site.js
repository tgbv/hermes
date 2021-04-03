const {SiteController} = require('../controller')
const {isLoggedIn} = require('../middleware')

module.exports = require('express').Router()

    /*
    *   for homepage
    */
    .get('/', isLoggedIn, SiteController.showHomepage)
    


    