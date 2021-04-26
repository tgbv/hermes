const {ApiKey} = require('../util')
const {UsersModel} = require('../model')

module.exports = async (req, res, next)=>{
    try {
        let User = await UsersModel.findOne({
            where: ApiKey.decode(req.params.key),
            attributes: ['id', 'suspended'],
        })

        if(User && !User.suspended){
            if(!req._) req._ = {}
            req._.User = User
            next()
        }else {
            return res.status(403).send({
                errors:[ "bad token or suspended user"]
            })
        }
    } catch(e) {
       // console.log(e)
        return res.status(403).send({
            errors:[ "bad token"]
        })
    }
}
