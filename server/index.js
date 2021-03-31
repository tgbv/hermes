/*
*   all import
*/
const Express = require('express')
const Dotenv = require('dotenv')
const Bodyparser = require('body-parser')
const Server = require('http')
const Compress = require('compression')


/*
*   all config
*/
Dotenv.config()
const App = Express()
    App.disable('x-powered-by')
    App.use(Compress())
    App.use(Bodyparser.json())
    App.use('/', require('./route'))

    // handles not found problems
    App.use((err, req, res,next)=>{
        res.status(404).send("Not found.")
    })

    // App.use((req, res,next)=>{
    //     res.status(404).send("Not found.")
    // })


App.listen("8080", ()=>{
    console.log("Listening on :8080")
})
