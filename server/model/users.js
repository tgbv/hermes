/*
*   relates with users table
*
*/

const {DB} = require('../server')
const {DataTypes} = require('sequelize')

const Model = DB.define('Users', {
    id: {
        type: DataTypes.MEDIUMINT,
        primaryKey: true,
        autoIncrement: true,
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

    suspended: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },

    created_at: { type: DataTypes.DATE},
    updated_at: { type: DataTypes.DATE},
}, {
    tableName: "users",
    createdAt: false,
    updatedAt: "updated_at",
})

Model.hasOne(require('./TofaTokens'), {
    as: "tofa_token",
    foreignKey: "user_id",
})

module.exports = Model
