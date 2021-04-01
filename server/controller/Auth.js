const {AuthSchema} = require('../schemas')
const {t} = require('../util')
const {UsersModel} = require('../model')

const Argon2 = require('argon2')
const crs = require('crypto-random-string')

module.exports = {
    loginForm(req, res ){

    },


    async login(req, res){

    },

    regForm(req, res){
        res.status(301).setHeader("location", "/")
        res.send()
    },

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
                apikey: crs({length:8, type: 'ascii-printable'}),
            })

            res.send(t('home', {
                errors: ["User created with success! You may now login."]
            }))
        }
    }
}
