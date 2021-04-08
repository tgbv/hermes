/*
*   handles the connection to MariaDB. Uses Sequelize as ORM.
*/

const {Sequelize} = require('sequelize')

const Instance = new Sequelize({
    dialect: "mariadb",
    host: process.env.DB_HOST,
    username: process.env.DB_USR,
    password: process.env.DB_PSS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    dialectOptions:{
        timezone: "+00:00",
        keepAlive: true,
    },
    define:{
        charset:'utf8'
    },
    benchmark: false,
    logging: false
});

module.exports = Instance