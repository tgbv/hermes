const {apiSendSMS} = require('../schemas')
const {messageIsBlacklisted, sendSMS} = require('../util')
const { SentMessagesModel } = require('../model')

const axios = require('axios')



module.exports = {

    /*
    *   sends message by token
    */
   async sendByToken(req, res)
   {
       try {
            let r = {
                errors: [],
            }

            // check if message is blacklisted
            if (await messageIsBlacklisted(req.body)){
                r.errors.push("Message contains blacklisted phrases.")
                return res.status(422).send(r)
            }

            // pass request to the micromodule
            sendSMS({...req.body, ...{user_id: req._.User.id}})
            .then(r=>res.send())
            .catch(r=>res.status(r.includes("Server error occurred") ? 500 : 422).send({errors: r}))
        // should not be reached
        } catch(e) {
            res.status(500).send({})
        }
   }

}
