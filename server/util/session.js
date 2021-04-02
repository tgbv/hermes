/*
*   handles sessions
    stored in an util because it allows me to use it in what route I like
*/
const Session = require('express-session')
const MySQLStore = require('express-mysql-session')(Session);

const Instance = Session({
    secret: process.env.APP_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: 'auto' },
    store: new MySQLStore({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USR,
        password: process.env.DB_PSS,
        database: process.env.DB_NAME,
    })
})

module.exports = Instance
