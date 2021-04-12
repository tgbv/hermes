const {UsersModel, SentMessagesModel} = require('../model')
const {t, redir} = require('../util')

module.exports = {

    /*
    *   shows all users paginated
    */
    async showUsers(req, res, next){
        try {
            let page = req.query.page === undefined || req.query.page < 2 ? 1 : parseInt(req.query.page)
            let nr = req.query.nr === undefined || req.query.nr < 1 ? 20 : parseInt(req.query.nr)

            res.send(
                t('dash/admin/showUsers', {
                    Users: await UsersModel.findAll({
                        order:[ ['id', 'DESC'] ],
                        limit: nr,
                        offset: page*nr-nr
                    }),
                    UsersCount: await UsersModel.count(),
                    page, nr,

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

            res.send(
                t('dash/admin/sentMessages', {
                    SentMessages: await SentMessagesModel.findAll({
                        order:[ ['id', 'DESC'] ],
                        limit: nr,
                        offset: page*nr-nr,
                        include:[
                            {model:UsersModel, as: "user"}
                        ]
                    }),
                    MessagesCount: await UsersModel.count(),
                    page, nr,

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

            redir(res, req.session.location_prev)

        } catch(e){
            console.log(e)
            redir(res, `${req.session.location_prev}?errors=["Server error occurred."]`)
        }
    }

}
