/*
*   relates with users table
*
*/

const {DB} = require('../server')
const {DataTypes} = require('sequelize')


module.exports = DB.define('Users', {
    id: {
        type: DataTypes.MEDIUMINT,
        primaryKey: true,
    },

    username: {
        type: DataTypes.STRING,
    },

    password: {
        type: DataTypes.STRING
    },

    apikeysalt: {
        type: DataTypes.STRING,
        allowNull: true,
    },

    verified: { 
        type:DataTypes.BOOLEAN,
        defaultValue: 0,
    },

    created_at: { type: DataTypes.DATE},
    updated_at: { type: DataTypes.DATE},
}, {
    tableName: "users",
    createdAt: false,
    updatedAt: "updated_at",
})

