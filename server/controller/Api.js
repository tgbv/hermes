const {apiSendSMS} = require('../schemas')
const {messageIsBlacklisted} = require('../util')

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
            axios.post(process.env.SMS_SEND_HOST, req.body)
            .then(response=>{
                res.send({})
            }).catch(e=>{
                if(e.response === undefined) return res.status(500).send({})

                e.response.data.errors.forEach(item=>{
                    r.errors.push(item.title)
                })

                res.status(422).send(r)
            })
        // should not be reached
        } catch(e) {
            res.status(500).send({})
        }
   }

}
