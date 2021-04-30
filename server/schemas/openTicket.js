const Joi = require('joi')

module.exports = Joi.object({
    topic: Joi.string().min(3).max(256).required(),
    message: Joi.string().min(3).max(100000).required(),
})

