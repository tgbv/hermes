const {t, redir, ApiKey} = require('../util')
const { UsersModel} = require('../model')
const {ChangePasswordSchema} = require('../schemas')

const Argon2 = require('argon2')
const Captcha = require('svg-captcha')

/*
*   reusable method for current controllers set
*/
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
        try {
            let User = await getUser(req.session.user_id)
            
            res.send( t('dash/dash', {
                User: User,
                apiKey: ApiKey.generate(User),
            }) )
        } catch(e){
            //console.log(e)
           redir(res, `/dash?errors=["Server error occurred!"]`)
        }
    },

    /*
    *   shows account information section
    */
    async showAccountInformation(req, res){
        try {
            let User = await getUser(req.session.user_id)
            
            res.send( t('dash/accountInfo', {
                User: User,
                apiKey: ApiKey.generate(User),
            }) )
        } catch(e){
            console.log(e)
           redir(res, `/dash?errors=["Server error occurred!"]`)
        }
    },

    /*
    *   shows the demo SMS page
    */
    async showDemoSMS(req, res){
        try {
            let User = await getUser(req.session.user_id)
            
            res.send( t('dash/sendDemoSMS', {
                apiKey: ApiKey.generate(User),
            }) )
        } catch(e){
            //console.log(e)
           redir(res, `/dash?errors=["Server error occurred!"]`)
        }
    },

    /*
    *   shows the api reference
    */
    async showApiReference(req, res){
        try {
            let User = await getUser(req.session.user_id)
            
            res.send( t('dash/apiRef', {
                apiKey: ApiKey.generate(User),
            }) )
        } catch(e){
            //console.log(e)
           redir(res, `/dash?errors=["Server error occurred!"]`)
        }
    },


    /*
    *   regenerates the API key
    */
    async regenerateAPI(req, res){
        const routeRedir = "/dash/account-information"

        try {

            let User = await getUser(req.session.user_id)

            await User.update({
                apikeysalt: ApiKey.makeSalt()
            })

            redir(res, routeRedir)
        } catch(e){
            redir(res, routeRedir+`?errors=["Server error occurred!"]`)
        }
    },

    /*
    *   changes account password
    */
    async changePassword(req, res){

        const routeRedir = "/dash/account-information"

        try{
            // verifies req body
            let values = ChangePasswordSchema.validate(req.body)
            if( values.error) return redir(res, routeRedir+'?errors='+JSON.stringify(values.error.details))

            let User = await getUser(req.session.user_id)

            if(await Argon2.verify(User.password, req.body.old_password))
            {
                await User.update({
                    password: await Argon2.hash(req.body.new_password)
                })

                redir(res, routeRedir+'?errors=["Password changed!"]')
            }
            else 
                redir(res, routeRedir+'?errors=["Old password is incorrect"]')   

       }catch(e){
           redir(res, routeRedir+'?errors=["Server error occurred"]')
       }
    }
}
