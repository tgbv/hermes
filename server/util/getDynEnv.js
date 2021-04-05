const Fs = require('fs')

module.exports = ()=>{
    let p = Fs.realpathSync(__dirname + '/../.dyn.env')
    return JSON.parse(
        Fs.readFileSync(p)
    )
}
