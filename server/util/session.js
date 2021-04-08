/*
*   handles sessions
    stored in an util because it allows me to use it in what route I like
*/
// express-mysql-session
const Session = require('express-session')
const SQLStore = require('connect-session-sequelize')(Session.Store);
const {DataTypes} = require('sequelize')
const { DB } = require('../server')

// sessions model
DB.define("sessions", {
    expires: DataTypes.DATE,
    data: DataTypes.TEXT,
    sid: {
        type: DataTypes.STRING,
        primaryKey: true,
    }
}, {
    initialAutoIncrement: false,
});

// sequelize instance
const Instance = Session({
    secret: process.env.APP_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: 'auto' },
    store: new SQLStore({
        db: DB,
        table: 'sessions',
        checkExpirationInterval: 15 * 60 * 1000, // The interval at which to cleanup expired sessions in milliseconds.
        expiration: 60 * 60 * 1000,  // The maximum age (in milliseconds) of a valid session.
    }),
    resave: false,
    proxy: false,
})

module.exports = Instance
