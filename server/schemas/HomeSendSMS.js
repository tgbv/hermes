const Joi = require('joi')

module.exports = Joi.object({
    captcha_demo: Joi.string().min(5).max(5).required(),
    terms_of_service: Joi.string().equal("on").required(),
}).concat(require('./apiSendSMS'))
