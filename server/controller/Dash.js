const {t, redir, ApiKey} = require('../util')
const { UsersModel} = require('../model')
const Argon2 = require('argon2')
const {ChangePasswordSchema} = require('../schemas')

const getUser = async (id)=>{
    return await UsersModel.findOne({
        where: {id}
    })
}

module.exports = {
    /*
    *   shows the dashboard
    */
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
    },

    /*
    *   changes account password
    */
   async changePassword(req, res){
       // verifies req body
        let values = ChangePasswordSchema.validate(req.body)
        if( values.error) return redir(res, '/dash?errors='+JSON.stringify(values.error.details))

       let User = await getUser(req.session.user_id)

       if(await Argon2.verify(User.password, req.body.old_password))
       {
           await User.update({
               password: await Argon2.hash(req.body.new_password)
           })

           redir(res, '/dash?errors=["Password changed!"]')
       }
       else 
            redir(res, '/dash?errors=["Old password is incorrect"]')

   }
}
