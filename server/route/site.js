const {SiteController} = require('../controller')
const {isLoggedIn} = require('../middleware')
const {t} = require('../util')

module.exports = require('express').Router()

    /*
    *   for homepage
    */
    .get('/', isLoggedIn, SiteController.showHomepage)
    
    .post('/send-demo', SiteController.sendDemo)

    .get('/tos', (req, res)=>{ res.send(t('tos'))})
    .get('/faq', (req, res)=>{ res.send(t('faq'))})

    