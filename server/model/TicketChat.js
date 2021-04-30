/*
*   relates with ticket_chat table
*
*/

const {DB} = require('../server')
const {DataTypes} = require('sequelize')


const Model = DB.define('TicketChat', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    ticket_id: {
        type: DataTypes.MEDIUMINT,
    },

    created_by: {
        type: DataTypes.MEDIUMINT
    },

    message: {
        type: DataTypes.TEXT,
    },

    created_at: { type: DataTypes.DATE},
}, {
    tableName: "ticket_chat",
    updatedAt: false,
    createdAt: "created_at",
})

Model.belongsTo(require('./users'), {
    as: "user",
    foreignKey: 'created_by',
})

module.exports = Model
