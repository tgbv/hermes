const {t, makeCaptcha, redir, messageIsBlacklisted, getDynEnv, sendSMS} = require('../util')
const {HomeSendSMSSchema} = require('../schemas')

const axios = require('axios')

module.exports = {
    /*
    *   shows site's homepage
    */
    showHomepage(req, res){
        let C = makeCaptcha(10)
        let Cdemo = makeCaptcha()

        req.session.captcha_reg = C.text
        req.session.captcha_demo = Cdemo.text

        res.send(t('home', {
            captcha_reg: C.svg,
            captcha_demo: Cdemo.svg,
        }))
    },

    /*
    *    sends a demo message from site (aka homepage)
    */
    async sendDemo(req, res){
        try {
            //check schema
            let values = HomeSendSMSSchema.validate(req.body)
            if(values.error) return redir(res, '/?errors='+JSON.stringify(values.error.details))

            const { captcha_demo} = req.body

            // check captcha
            if(req.session.captcha_demo !== captcha_demo)
                return redir(res, '/?errors=["Captcha is incorrect! Please retry."]')

            // check if is allowed to send sms
            if(req.session.sms_count >= getDynEnv()['max_sms_per_session'])
                return redir(res, `/?errors=["You can send only ${getDynEnv('max_sms_per_session')} demo SMS."]`)

            // check if message is blacklisted
            if (await messageIsBlacklisted(req.body)){
                return redir(res, '/?errors=["Message contains blacklisted words"]')
            }

            // send sms
            sendSMS(req.body)
            .then(r=>redir(res, '/?errors='+JSON.stringify(r)))
            .catch(r=>redir(res, '/?errors='+JSON.stringify(r)))

        } catch(e){
            console.log(e)
            redir(res, `/?errors=["Server error occurred!"]`)
        }
    }
}
