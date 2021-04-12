const {AuthSchema} = require('../schemas')
const {t, redir, ApiKey, makeCaptcha, getDynEnv} = require('../util')
const {UsersModel, ApiThrottlesModel} = require('../model')

const Argon2 = require('argon2')
const Captcha = require('svg-captcha')

module.exports = {
    loginForm(req, res ){
        let C = makeCaptcha()

        req.session.captcha_log = C.text

        res.send(t('login', {
            captcha_log: C.svg
        }))
    },

    /*
    *   login user
    */
    async login(req, res){
        try {

        // validate request body
        let values = AuthSchema.Login.validate(req.body)
        if(values.error){
            return redir(res, "/auth/login?errors="+JSON.stringify(values.error.details))
        }

        const {username, password, captcha_log} = req.body

        // check if captcha is good
        if(req.session.captcha_log !== captcha_log)
            return redir(res, "/auth/login?errors="+JSON.stringify([encodeURIComponent("Invalid recaptcha. Please retry. Note it's &nbsp;<b>case-sensitive</b>.")]))

        // get user
        let User = await UsersModel.findOne({
            where:{ username},
            attributes:['id', 'username', 'password', 'suspended'],
        })

        if( User && await Argon2.verify(User.password, password) ){
            if(User.suspended) 
                return redir(res, `/auth/login?errors=["Account is banned"]`)
            else {
                req.session.user_id = User.id
                redir(res, "/")                
            }
        }
        else {
            return redir(res, "/auth/login?errors="+JSON.stringify([encodeURIComponent("Invalid username or password.")]))
        }


        }catch(e){
            return redir(res, `/auth/login?errors=["Server error occurred."]`)
        }
    },

    async logout(req, res, next){
        delete req.session["user_id"];
        return redir(res, '/auth/login')
    },

    regForm(req, res){
        return redir(res, "/")
    },

    /*
    *   register user
    */
    async register (req, res){
        try {

        // validate request body
        let values = AuthSchema.Register.validate(req.body)
        if(values.error){
            return redir( res, "/?errors="+JSON.stringify(values.error.details) )
        }
        
        const {username, password, captcha_reg} = req.body

        // check if captcha is good
        if(req.session.captcha_reg !== captcha_reg)
            return redir(res, "/?errors="+JSON.stringify([encodeURIComponent("Invalid recaptcha. Please retry. Note it's &nbsp;<b>case-sensitive</b>.")]))

        // check if is allowed to register again
        if(req.session.signup_count >= getDynEnv()['max_signup_per_session'])
            return redir(res, `/?errors=["You can only register ${getDynEnv('max_signup_per_session')} time(s)."]`)

        // check if username is taken
        let User = await UsersModel.findOne({
            where: { username }
        })

        if(User){
            return redir(res, "/?errors="+JSON.stringify([encodeURIComponent("Username has already been taken.")]))
        } else {

            User = await UsersModel.create({
                username,
                password: await Argon2.hash(password),
                apikeysalt: ApiKey.makeSalt(),
            })

            await ApiThrottlesModel.create({
                user_id: User.id,
            })

            req.session.signup_count++

            return redir(res, "/auth/login?errors="+JSON.stringify([encodeURIComponent("User created with success! You may now login.")]))
            
        }

        }catch(e){
            console.log(e)
            return redir(res, `/?errors=["Server error occurred."]`)
        }
    }
}
