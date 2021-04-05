const { getDynEnv} = require('../util')

module.exports = (req, res, next)=>{
    // get dynamic env config && check
    if(getDynEnv()['down'])
        return res.status(503).send("Server temporarily down for maintenance.")
    else next()
}
