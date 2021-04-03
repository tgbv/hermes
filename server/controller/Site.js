const {t, makeCaptcha} = require('../util')

module.exports = {
    async showHomepage(req, res){
        let C = makeCaptcha()

        req.session.captcha_reg = C.text

        res.send(t('home', {
            captcha_reg: C.svg
        }))
    }
}
