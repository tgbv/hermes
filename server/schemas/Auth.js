const Joi = require('joi')


module.exports = {
    
    Login: Joi.object({
        username: Joi.string().min(3).max(128).required(),
        password: Joi.string().min(5).max(64).required(),
    }),

    Register: Joi.object({
        username: Joi.string().min(3).max(128).required(),
        password: Joi.string().min(5).max(64).required(),
    }),
}