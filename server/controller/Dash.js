const {t, redir, ApiKey, deleteUser} = require('../util')
const { UsersModel, TicketChatModel, TicketsModel, SentMessagesModel} = require('../model')
const {ChangePasswordSchema} = require('../schemas')

const Argon2 = require('argon2')
const Captcha = require('svg-captcha')
const openTicket = require('../schemas/openTicket')

/*
*   reusable method for current controllers set
*/
const getUser = async (id)=>{
    return await UsersModel.findOne({
        where: {id}
    })
}

module.exports = {
    /*
    *   shows the dashboard
    */
    async showFront(req, res){
        try {
            let User = await getUser(req.session.user_id)
            
            res.send( t('dash/dash', {
                User,
                apiKey: ApiKey.generate(User),
            }) )
        } catch(e){
            console.log(e)
           redir(res, `/dash?errors=["Server error occurred!"]`)
        }
    },

    /*
    *   shows account information section
    */
    async showAccountInformation(req, res){
        try {
            let User = await getUser(req.session.user_id)
            
            res.send( t('dash/accountInfo', {
                User,
                apiKey: ApiKey.generate(User),
            }) )
        } catch(e){
            console.log(e)
           redir(res, `/dash?errors=["Server error occurred!"]`)
        }
    },

    /*
    *   shows the demo SMS page
    */
    async showDemoSMS(req, res){
        try {
            let User = await getUser(req.session.user_id)
            
            res.send( t('dash/sendDemoSMS', {
                apiKey: ApiKey.generate(User),
                User
            }) )
        } catch(e){
            console.log(e)
           redir(res, `/dash?errors=["Server error occurred!"]`)
        }
    },

    /*
    *   shows the api reference
    */
    async showApiReference(req, res){
        try {
            let User = await getUser(req.session.user_id)
            
            res.send( t('dash/apiRef', {
                apiKey: ApiKey.generate(User),
                User,
            }) )
        } catch(e){
            console.log(e)
           redir(res, `/dash?errors=["Server error occurred!"]`)
        }
    },


    /*
    *   regenerates the API key
    */
    async regenerateAPI(req, res){
        const routeRedir = "/dash/account-information"

        try {

            let User = await getUser(req.session.user_id)

            await User.update({
                apikeysalt: ApiKey.makeSalt()
            })

            redir(res, routeRedir)
        } catch(e){
            console.log(e)
            redir(res, routeRedir+`?errors=["Server error occurred!"]`)
        }
    },

    /*
    *   changes account password
    */
    async changePassword(req, res){

        const routeRedir = "/dash/account-information"

        try{
            // verifies req body
            let values = ChangePasswordSchema.validate(req.body)
            if( values.error) return redir(res, routeRedir+'?errors='+JSON.stringify(values.error.details))

            let User = await getUser(req.session.user_id)

            if(await Argon2.verify(User.password, req.body.old_password))
            {
                await User.update({
                    password: await Argon2.hash(req.body.new_password)
                })

                redir(res, routeRedir+'?errors=["Password changed!"]')
            }
            else 
                redir(res, routeRedir+'?errors=["Old password is incorrect"]')   

       }catch(e){
           console.log(e)
           redir(res, routeRedir+'?errors=["Server error occurred"]')
       }
    },

    /*
    *   retrieves all user's tickets
    */
    async getMyTickets(req, res){
        try {
            res.send( t('dash/tickets', {
                User: await getUser(req.session.user_id),
                tickets: await TicketsModel.findAll({
                    where:{ user_id: req.session.user_id },
                    order: [
                        [ 'closed', 'asc' ],
                        ['id', 'asc'],
                    ]
                })
            }) )
        } catch(e){
            console.log(e)
            redir(res, `/dash?errors=["Server error occurred!"]`)    
        }
    },

    /*
    *   retrieve ticket data
    */
    async getTicketData(req, res){
        try {
            where = {}

            // in case it's admin
            if(req.session.user_id === 1)
                where = {id: req.params.ticket_id}
            else 
                where = { 
                    id: req.params.ticket_id, 
                    user_id: req.session.user_id,  
                }

            res.send( t('dash/ticketChat', {
                User: await getUser(req.session.user_id),
                Ticket: await TicketsModel.findOne({
                    where,
                    include:[{
                        model:TicketChatModel, 
                        as: "chat",
                        include: [{
                            model: UsersModel,
                            as: 'user',
                        }]
                    }],
                    order:[
                        [{ model: TicketChatModel, as: 'chat'}, 'id', 'asc']
                    ]
                })
            }) )
        } catch(e){
            console.log(e)
            redir(res, `/dash?errors=["Server error occurred!"]`)    
        }
    },

    /*
    *   opens a new ticket
    */
    async openTicket(req, res){
        try {
            // make ticket
            let Ticket = await TicketsModel.create({
                user_id: req.session.user_id,
                topic: req.body.topic,
            })

            // make default message
            await TicketChatModel.create({
                ticket_id: Ticket.id,
                created_by: req.session.user_id,
                message: req.body.message,
            })

            // Done
            redir(res, `/dash/tickets`)
        } catch(e){
            console.log(e)
            redir(res, `/dash?errors=["Server error occurred!"]`)    
        }
    },

    /*
    *   sends a ticket message 
    */
    async sendTicketMessage(req, res){
        try {
            where = {}

            // in case it's admin
            if(req.session.user_id === 1)
                where = {id: req.params.ticket_id}
            else 
                where = { 
                    id: req.params.ticket_id, 
                    user_id: req.session.user_id,  
                }

            // attempt to get ticket
            let Ticket = await TicketsModel.findOne({
                where,
            })

            // make message
            await TicketChatModel.create({
                ticket_id: Ticket.id,
                created_by: req.session.user_id,
                message: req.body.message,
            })

            // update seen states
            // attempt to get ticket
            Ticket.update({
                admin_read: req.session.user_id === 1 ? 1 : 0,
                user_read: req.session.user_id === 1 ? 0 : 1,
                closed: 0,
            })

            // Done
            redir(res, `/dash/tickets/${req.params.ticket_id}`)
        } catch(e){
            console.log(e)
            redir(res, `/dash/tickets?errors=["Server error occurred!"]`)    
        }
    },

    /*
    *   opens/close ticket
    */
    async swapTicketState(req, res){
        try {
            where = {}

            // in case it's admin
            if(req.session.user_id === 1)
                where = {id: req.params.ticket_id}
            else 
                where = { 
                    id: req.params.ticket_id, 
                    user_id: req.session.user_id,  
                }

            // attempt to get ticket
            let Ticket = await TicketsModel.findOne({
                where,
            })
            
            // swap
            Ticket.update({
                closed: parseInt(req.params.state) > 0 ? true : false,
            })

            // Done
            if(req.session.user_id === 1)
                redir(res, `/dash/admin/tickets`)
            else
                redir(res, `/dash/tickets`)
        } catch(e){
            console.log(e)
            redir(res, `/dash?errors=["Server error occurred!"]`)    
        }
    },

    /*
    *   delete account and all affiliated data
    */
    async delAccount(req, res){
        try {
            await deleteUser(req.session.user_id)
            delete req.session["user_id"]   // this dumb shit must be deleted manually
                                            // I know why i call it dumb shit

            redir(res, `/?errors=["Account removed with success!"]`)
        }catch(e){
            console.log(e)
            redir(res, `${req.session.location_prev}?errors=["Server error occurred!"]`)    
        }
    }


}
