/*
*   relates with tickets table
*
*/

const {DB} = require('../server')
const {DataTypes} = require('sequelize')


const Model = DB.define('Tickets', {
    id: {
        type: DataTypes.MEDIUMINT,
        primaryKey: true,
        autoIncrement: true,
    },

    user_id: {
        type: DataTypes.MEDIUMINT,
    },

    topic: {
        type: DataTypes.STRING
    },

    admin_read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },

    user_read: { 
        type:DataTypes.BOOLEAN,
        defaultValue: true,
    },

    closed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },

    created_at: { type: DataTypes.DATE},
}, {
    tableName: "tickets",
    updatedAt: false,
    createdAt: "created_at",
})

Model.hasMany(require('./TicketChat'), {
    as: 'chat',
    foreignKey: 'ticket_id',
    sourceKey: 'id',
})

module.exports = Model

