/*
*   relates with sent_messages table
*
*/

const {DB} = require('../server')
const {DataTypes} = require('sequelize')

const Model = DB.define('SentMessages', {

    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },

    user_id: {
        type: DataTypes.MEDIUMINT,
        defaultValue: null,
    },

    sender: {
        type: DataTypes.STRING
    },

    receipt: {
        type: DataTypes.STRING,
    },

    text: {
        type: DataTypes.TEXT
    },

}, {
    tableName: "sent_messages",
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
})

/*
*   logs a sent message to database
*/
Model.logMessage = async function(obj){
    try {
        await this.create( obj )
    } catch(e) {
        console.log (e)
    }
}

Model.belongsTo(require('./users'), {
    as: 'user',
    foreignKey: 'user_id',
})

module.exports = Model