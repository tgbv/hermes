const {AuthSchema} = require('../schemas')
const {t, redir, ApiKey} = require('../util')
const {UsersModel} = require('../model')

const Argon2 = require('argon2')

module.exports = {
    loginForm(req, res ){
        res.send(t('login'))
    },

    async login(req, res){
        // validate request body
        let values = AuthSchema.Register.validate(req.body)
        if(values.error){
            return res.status(422).send(t('login', {
                errors: values.error.details,
                original: values.error._original,
            }))
        }

        const {username, password} = req.body

        // get user
        let User = await UsersModel.findOne({
            where:{ username},
            attributes:['id', 'username', 'password'],
        })

        if( User && await Argon2.verify(User.password, password) ){
            req.session.user_id = User.id
            redir(res, "/")
        }
        else {
            res.status(422).send(t('login',{
                errors:['Invelid username or password.'],
                original: req.body,
            }))
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
        // validate request body
        let values = AuthSchema.Register.validate(req.body)
        if(values.error){
            return res.status(422).send(t('home', {
                errors: values.error.details,
                original: values.error._original,
            }))
        }
        
        const {username, password} = req.body

        // check if username is taken
        let User = await UsersModel.findOne({
            where: { username }
        })

        if(User){
            return res.status(422).send(t('home', {
                errors: ["Username has already been taken!"],
                original: req.body,
            }))
        } else {

            User = await UsersModel.create({
                username,
                password: await Argon2.hash(password),
                apikeysalt: ApiKey.makeSalt(),
            })

            res.send(t('login', {
                errors: ["User created with success! You may now login."]
            }))
        }
    }
}
