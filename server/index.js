/*
*   all import
*/
const Express = require('express')
const Dotenv = require('dotenv'); Dotenv.config()
const Compress = require('compression')
const {sHttp, DB} = require('./server');
const {serverDown} = require('./middleware');
const tofaInit = require('tofa-server-js').init;

/*
*   all config
*/
(async ()=>{

    try {
        await DB.authenticate()
    } catch(e) {
        console.log("Could not connect to DB!", e)
    }

    tofaInit('127.0.0.1:9050')

    const App = Express()
        App.disable('x-powered-by')
        App.disable('etag')
        App.use(serverDown)
        App.use(Compress())
        App.use('/', require('./route'))

        // handles not found problems
        App.use((err, req, res,next)=>{
            res.status(500).send("Error occurred. Please try again later.")
            console.log(err)
        })

        // App.use((req, res,next)=>{
        //     res.status(404).send("Not found.")
        // })

    const Server = sHttp(App)


    // once config is done, we can put our servers online
    Server.listen(process.env.LISTEN_PORT, "127.0.0.1", ()=>{
        console.log(`Listening on :${process.env.LISTEN_PORT}`)
    }) 
})();

