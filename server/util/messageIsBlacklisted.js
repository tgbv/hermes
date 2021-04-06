const axios = require('axios')

// checks if message data contains words/expressions which are blacklisted
module.exports = async (object)=>{
    try {
        let r = await axios.post(process.env.SMS_BLACKLIST_HOST, object)

        return !r.data.safe
    } catch(e) {
        // console.log(e)
        return false
    }
}
