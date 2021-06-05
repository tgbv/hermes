/*
*   relates with users table
*
*/

const {DB} = require('../server')
const {DataTypes} = require('sequelize')


const Model = DB.define('TofaTokens', {
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },

    uri: {
        type: DataTypes.STRING,
    },

    auth_token: {
        type: DataTypes.STRING
    },
}, {
    tableName: "tofa_tokens",
    timestamps: false,
})


module.exports = Model
