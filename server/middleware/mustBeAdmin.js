module.exports = (req, res, next)=>{
    return req.session.user_id === 1 ? next() : res.status(403).send("Forbidden.");
}
