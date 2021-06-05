/*
*   relates with PR table
*
*/

const {DB} = require('../server')
const {DataTypes} = require('sequelize')


const Model = DB.define('PRTokens', {
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },

    token: {
        type: DataTypes.STRING,
    },
}, {
    tableName: "pr_tokens",
})

Model.hasOne(require('./users'), {
    as: "user",
    foreignKey: "id",
    sourceKey:'user_id',
})

module.exports = Model
