const {apiSendSMS} = require('../schemas')
const axios = require('axios')

module.exports = {

    /*
    *   sends message by token
    */
   async sendByToken(req, res)
   {
        let r = {
            message: "",
            errors: [],
        }

        // check req body schema
        let values = apiSendSMS.validate(req.body)
        if(values.error){
            r.errors = values.error.details
            return res.status(422).send(r)
        }

        // pass request to the micromodule
        axios.post(process.env.SMS_SEND_HOST, req.body)
        .then(response=>{
            r.message = "Ok"
            res.send(r)
        })
        .catch(e=>{
            if(e.response === undefined) return res.status(500).send({})

            e.response.data.errors.forEach(item=>{
                r.errors.push(item.title)
            })

            res.status(422).send(r)
        })
   }

}
