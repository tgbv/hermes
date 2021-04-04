/*
*   relates with api_throttles table
*
*/

const {DB} = require('../server')
const {DataTypes} = require('sequelize')


module.exports = DB.define('ApiThrottles', {
    user_id: {
        type: DataTypes.MEDIUMINT,
        primaryKey: true,
    },

    count: {
        type: DataTypes.SMALLINT,
        defaultValue: 0,
    },

    touched: {
        type: DataTypes.DATE,
        defaultValue: null,
    },
}, {
    tableName: "api_throttles",
    timestamps: false
})

