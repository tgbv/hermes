const axios = require('axios')
const {SentMessagesModel} = require('../model')
const getDynEnv = require('./getDynEnv')

/*
*   handles SMS sending via SMS-SEND
*/
const f = (input, retry = true)=>{
    return new Promise((resolve, reject)=>{
        axios.post(process.env.SMS_SEND_HOST, input)
        .then(response=>{
            try {
                SentMessagesModel.logMessage({
                    sender: input.from,
                    receipt: input.to,
                    text: input.text,
                    user_id: input.user_id ? input.user_id : null,
                })
            } catch(stupidDatabaseErrorAteManyHoursOfMyLife) {
                console.log(stupidDatabaseErrorAteManyHoursOfMyLife)
            }

            resolve(["Message sent!"])
        })
        .catch(async e=>{
            if(e.response === undefined) return reject(["Server error occurred"])
            
            let errors = []
            let tmp = e.response.data.errors

            for(let i=0; i<tmp.length; i++)
            {
                // Attempts to resend message in case of invalid source/from
                if((tmp[i].title === "Invalid 'from' address" || 
                    tmp[i].title === "Invalid messaging source number") && retry )
                {
                    f({...input, ...{from: getDynEnv('fallback_number')}}, false)
                    .then(r=>resolve(r))
                    .catch(r=>reject(r))
                    return
                }
                errors.push(tmp[i].title)
            }

            reject(errors)
        })
    })
}

module.exports = f
