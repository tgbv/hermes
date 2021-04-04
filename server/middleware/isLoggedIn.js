const {redir} = require('../util')

module.exports = (req, res, next)=>{
    if(req.session.user_id && !req.baseUrl.includes("dash")) {
        return redir(res, "/dash")
    } else {
        //console.log(req.session.user_id)
        next()
    }
}
