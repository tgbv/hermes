const Op = require('sequelize').Op
const {UsersModel, SentMessagesModel} = require('../model')
const { DB } = require('../server')
const {t, redir} = require('../util')

module.exports = {

    /*
    *   shows all users paginated
    */
    async showUsers(req, res, next){
        try {
            let page = req.query.page === undefined || req.query.page < 2 ? 1 : parseInt(req.query.page)
            let nr = req.query.nr === undefined || req.query.nr < 1 ? 20 : parseInt(req.query.nr)

            const {username, suspended} = req.query
            let where = {}

            // If a lookup has been performed
            if(username !== undefined || suspended !== undefined)
            {
                where = [
                    {
                        username: {
                            [Op.like]: `%${username}%`
                        }
                    },
                    { suspended: suspended }
                ]
            }

            res.send(
                t('dash/admin/showUsers', {
                    Users: await UsersModel.findAll({
                        where,
                        order:[ ['id', 'DESC'] ],
                        limit: nr,
                        offset: page*nr-nr
                    }),

                    UsersCount: await UsersModel.count({
                        where,
                        order:[ ['id', 'DESC'] ],
                        limit: nr,
                        offset: page*nr-nr
                    }),
                    page, nr, username, suspended,
                    prev_loc:req.session.location_prev, 

                    User: {id: req.session.user_id},
                })
            )
        }catch(e){
            console.log(e)
            redir(res, '/dash?errors=["Server error occurred."]')
        }
    },


    /*
    *   shows all sent messages paginated
    */
    async showSentMessages (req, res, next) {
        try {
            let page = req.query.page === undefined || req.query.page < 2 ? 1 : parseInt(req.query.page)
            let nr = req.query.nr === undefined || req.query.nr < 1 ? 20 : parseInt(req.query.nr)

            const {user, sender, receipt,text} = req.query
            let where = {}

            // If a lookup has been performed
            if(user !== undefined || 
                sender !== undefined || 
                receipt !== undefined ||
                text !== undefined)
            {
                where = [
                    { sender: { [Op.like]: `%${sender}%` } },
                    { receipt: { [Op.like]: `%${receipt}%` } },
                    { text: { [Op.like]: `%${text}%` } },
                ]

                if(user !== undefined && user !== '') {
                    where.push({  "$user.username$": { [Op.like]: `%${user}%` } },)
                }
            }

            res.send(
                t('dash/admin/sentMessages', {
                    SentMessages: await SentMessagesModel.findAll({
                        where,
                        order:[ ['id', 'DESC'] ],
                        limit: nr,
                        offset: page*nr-nr,
                        include:[
                            {model:UsersModel, as: "user"}
                        ]
                    }),
                    MessagesCount: await SentMessagesModel.count({
                        where,
                        order:[ ['id', 'DESC'] ],
                        limit: nr,
                        offset: page*nr-nr,
                        include:[
                            {model:UsersModel, as: "user"}
                        ]
                    }),
                    page, nr, user, sender, receipt,text,
                    prev_loc:req.session.location_prev, 

                    User: {id: req.session.user_id},
                })
            )
        }catch(e){
            console.log(e)
            redir(res, '/dash?errors=["Server error occurred."]')
        }
    },

    /*
    *   swaps a user suspension (ban) state
    */
    async swapBanState(req, res, next) {
        try {
            const User = await UsersModel.findOne({
                where: { id: req.params.user_id },
                attributes: ['id', 'suspended'],
            })

            await User.update({
                suspended: !User.suspended
            })

            // Delete all related sessions from database
            if(User.suspended) {
                await DB.query(`
                    UPDATE sessions SET data = JSON_REMOVE(data, "$.user_id")
                    WHERE JSON_CONTAINS(data, "${User.id}", "$.user_id");
                `)
            }

            redir(res, req.session.location_prev)

        } catch(e){
            console.log(e)
            redir(res, `${req.session.location_prev}?errors=["Server error occurred."]`)
        }
    }

}
