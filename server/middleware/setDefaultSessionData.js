let { sessionInstance } = require('../util')

module.exports = (req, res, next)=>{
    let s = req.session

    s.user_id=        s.user_id === undefined ? undefined : s.user_id,
    s.signup_count=   s.signup_count === undefined ? 0 : s.signup_count,
    s.sms_count=      s.sms_count === undefined ? 0 : s.sms_count,  

    s.location_prev = s.location_curr
    s.location_curr = req.originalUrl

    sessionInstance = s

    next()
}
