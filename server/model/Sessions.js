const {DB} = require('../server')
const {DataTypes} = require('sequelize')

// sessions model
module.exports = DB.define("sessions", {
    expires: DataTypes.DATE,
    data: DataTypes.TEXT,
    sid: {
        type: DataTypes.STRING,
        primaryKey: true,
    },


}, {
    initialAutoIncrement: false,
    tableName: "sessions",
});
