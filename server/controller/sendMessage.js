const axios = require('axios')
const {apiSendSMS} = require('../schemas')

/*
*   should be used when client attempts to send a message
*/
module.exports = (req, res, next)=>{
    // the response
    r = {
        errors:[],
        success: [],
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
        r.success.push("Ok")
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
