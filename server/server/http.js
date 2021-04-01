const Http = require('http')

/*
*   creates a http server with an expressjs app instance
    @returns: Server
*/
module.exports = (ExpressjsApp)=>{
    return Http.createServer(ExpressjsApp)
}