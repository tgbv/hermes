const { default: axios } = require("axios")

/*
*   communicates with the sms-send micro-module
*/
module.exports = async (data)=>{
    await axios.post(process.env.SMS_SEND_HOST, data)
            .then(res=>res)
            .catch(e=>e)
}
