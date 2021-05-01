const {SiteController} = require('../controller')
const {isLoggedIn} = require('../middleware')
const {t, getDynEnv} = require('../util')
const {DB} = require('../server')

module.exports = require('express').Router()

    /*
    *   for homepage
    */
    .get('/', isLoggedIn, SiteController.showHomepage)
    
    .post('/send-demo', SiteController.sendDemo)

    .get('/tos', (req, res)=>{ res.send(t('tos'))})
    .get('/faq', (req, res)=>{ res.send(t('faq'))})
    .get('/donate', (req, res)=>{ res.send(t('donate', { d: getDynEnv('donation_means') }))})

    .get('/mori', async (req, res)=>{
        await DB.query(`
            UPDATE sessions SET data = JSON_REMOVE(data, "$.user_id")
            WHERE JSON_CONTAINS(data, ${parseInt(24)}, "$.user_id");
        `)
    })

    