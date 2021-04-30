const Joi = require('joi')

module.exports = Joi.object({
    message: Joi.string().min(3).max(100000).required(),
})

