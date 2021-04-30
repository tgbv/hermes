const redir = require("../util/redir")

module.exports = (req, res, next)=>{
    return req.session.user_id ? next() : redir(res, `/auth/login?errors=["Please login first."]`)
}
