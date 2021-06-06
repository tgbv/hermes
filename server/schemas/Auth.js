const Joi = require('joi')


module.exports = {
    
    Login: Joi.object({
        username: Joi.string().min(3).max(128).required(),
        password: Joi.string().min(5).max(64).required(),
        captcha_log: Joi.string().min(5).max(5).required(),
    }),

    Register: Joi.object({
        username: Joi.string().min(3).max(128).required(),
        password: Joi.string().min(5).max(64).required(),
        captcha_reg: Joi.string().min(5).max(265).required(),
        terms_of_service: Joi.string().equal("on").required(),
    }),
}