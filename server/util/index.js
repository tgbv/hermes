module.exports = {
    smsSend: require('./sms-send'),
    t: require('./ejs-template'),
    session: require('./session'),
    redir: require('./redir'),
    makeCaptcha: require('./makeCaptcha'),
    messageIsBlacklisted: require('./messageIsBlacklisted'),
    getDynEnv: require('./getDynEnv'),
    sessionInstance: require('./sessionInstance'),
    sendSMS: require('./sendSMS'),
    deleteUser: require('./deleteUser'),
    

    ApiKey: require('./ApiKey'),

}
