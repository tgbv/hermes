const { UsersModel, PRTokens, TofaTokens } = require('../model')
const {t, redir, ApiKey, makeCaptcha, getDynEnv} = require('../util')

const {ask} = require('tofa-server-js')
const {CallConflicts, CallForbidden, RequestFailed, CallTimedOut} = require('tofa-server-js/src/errors')

const crs = require('crypto-random-string')
const Argon2 = require('argon2')

module.exports = {
    showStep1(req, res){
        let C = makeCaptcha()

        req.session.captcha_recover = C.text

        res.send(t('recover-password/step1', {
            captcha_recover: C.svg
        }))
    },

    showStep2(req, res){
        res.send(t('recover-password/step2' ))
    },

    /**
     *  Generate PR token for user if it exists. 
     *  Redirects it to step2 if ok.
     */
    async processStep1(req, res){
        try {
            // check if user actually exists
            let User = await UsersModel.findOne({
                where: {username: req.body.username},
                include: [{model: TofaTokens, as: 'tofa_token'}]
            })
            if(!User) return redir(res, '/recover-password/step1?errors=["User not found"]')
            if(!User.tofa_token) return redir(res, '/recover-password/step1?errors=["2FA not registerd for account. Sorry, cannot recover password."]')

            // no multiple PRs/user
            await PRTokens.destroy({
                where: {user_id: User.id}
            })

            // check if user allows PR via Tofa
            let allow = await ask(User.tofa_token.uri, {
                auth_token: User.tofa_token.auth_token,
                description: `Someone is requesting a password reset for your Hermes account (${User.username}). Do you wish to allow it?`,
            })
            if(!allow) return redir(res, '/recover-password/step1?errors=["User denied action!"]')
            
            // make PR
            let token = crs({length: 64, type: 'base64'})
            await PRTokens.create({
                user_id: User.id,
                token,
            })

            // forward to step2
            redir(res, '/recover-password/step2/'+ encodeURIComponent(token))
        }catch(e){
            let message = 'Server error occurred. Please retry.'

            if(e instanceof CallForbidden)
                message = "Client is already registered for another service!"
            if(e instanceof RequestFailed || e instanceof CallTimedOut)
                message = "Client is not reachable. Please try again."
            if(e instanceof CallConflicts)
                message = "Client is busy processing another request. Finish the action in force then retry."

            redir(res, `/recover-password/step1?errors=[${message}]`)
        }
    },

    /**
     *  Update password if PR token is ok
     */
    async processStep2(req, res){
        try {
            // pr must exist
            let PR = await PRTokens.findOne({
                where: {token: decodeURIComponent(req.params.token)},
                include: [{model: UsersModel, as: 'user'}]
            })
            if(!PR) return redir(res, '/recover-password/step1?errors=["Bad token"]')

            // update pass
            await UsersModel.update({
                password: await Argon2.hash(req.body.password)
            }, {
                where:{id: PR.user.id}
            })

            // delete PR
            await PRTokens.destroy({
                where: {user_id: PR.user.id}
            })
            
            // forward to login
            redir(res, '/auth/login?errors=["Done! You may now login"]')
        }catch(e){
            console.log(e)
            redir(res, '/recover-password/step1?errors=["Server error occurred!"]')
        }
    }
}
