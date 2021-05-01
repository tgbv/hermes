const {UsersModel, TicketsModel, SentMessagesModel, ApiThrottlesModel, TicketChatModel} = require('../model')
const {DB} = require('../server')

/*
*   fully deletes a user from system
*/
module.exports = (user_id)=>{
    return new Promise(async (accept, reject)=>{
        try {
            // del user
            await UsersModel.destroy({
                where: {id: user_id},
            })

            // erase it from sessions table
            await DB.query(`
                UPDATE sessions SET data = JSON_REMOVE(data, "$.user_id")
                WHERE JSON_CONTAINS(data, ${parseInt(user_id)}, "$.user_id");
            `)

            // del its tickets
            await TicketsModel.destroy({
                where: {user_id}
            })

            // del tickets data
            await TicketChatModel.destroy({
                where: {created_by: user_id}
            })

            // del its sent messages
            await SentMessagesModel.destroy({
                where: {user_id}
            })

            // del throttles
            await ApiThrottlesModel.destroy({
                where: {user_id}
            })

           accept()
        }catch(e){
            console.log(e)
            reject(e)
        }
    })
}