const Joi = require('joi')

module.exports= Joi.object({
    old_password: Joi.string().min(5).max(64).required(),
    new_password: Joi.string().min(5).max(64).required(),
})
