const {ApiThrottlesModel} = require('../model')

/*
*   handles the API throttle

    1. touch is set to current datetime if null && nr of requests is incremented and touch stays the same
    2. if nr of requests exceeds MAX_REQ_NR and touch is still within TOUCH_INTERVAL, block requests
    3. otherwise allow request and reset the counter in database if necessary
*/
const MAX_REQ_NR = 5
const TOUCH_INTERVAL = 60 // seconds


// helper to update throttle
const touchThrottle = async(ApiThrottle)=>{
    await ApiThrottle.update({
        count: 1,
        touched: new Date(),
    })
}

module.exports = async (req, res, next)=>{
    try {

        let ApiThrottle = await ApiThrottlesModel.findOne({ where:{ user_id: req._.User.id }}) 

        // if touch is null
        if(ApiThrottle.touched === null){
            await touchThrottle(ApiThrottle)
            return next()
        } else {

            // touched timestamp
            let tts = new Date(ApiThrottle.touched).getTime() / 1000

            // current timestamp
            let cts = new Date().getTime() / 1000

            if(tts+TOUCH_INTERVAL > cts){
                if(ApiThrottle.count === MAX_REQ_NR){
                    return res.status(429).send({
                        errors: ['Too many requests. Throttle is: '+ MAX_REQ_NR+' / '+TOUCH_INTERVAL+'s']
                    })
                } else await ApiThrottle.update({ count: ApiThrottle.count+1 })
            } else await touchThrottle(ApiThrottle)

            return next()
        }

    } catch(e) {
        //console.log(e)
        return res.status(500).send({
            errors: ['Server error occurred!']
        })
    }
}
