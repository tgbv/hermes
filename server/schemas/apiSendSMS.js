const Joi = require('joi').extend(require("joi-phone-number"))

module.exports = Joi.object({
    from: Joi.string().regex(new RegExp("[^0-9.]")).max(11).required(),
    to: Joi.string().phoneNumber( ).required(),
    text: Joi.string().max(160).required(),
})

