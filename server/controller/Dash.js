const {t, redir, ApiKey} = require('../util')
const { UsersModel} = require('../model')

const getUser = async (id)=>{
    return await UsersModel.findOne({
        where: {id}
    })
}

module.exports = {
    async showFront(req, res){
        let User = await getUser(req.session.user_id)

        res.send( t('dash', {
            User: User,
            apiKey: ApiKey.generate(User)
        }) )
    },


    /*
    *   regenerates the API key
    */
    async regenerateAPI(req, res){
        let User = await getUser(req.session.user_id)

        await User.update({
            apikeysalt: ApiKey.makeSalt()
        })

        redir(res, "/dash")
    }
}
