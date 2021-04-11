const Fs = require('fs')

module.exports = (key = null)=>{
    let p = Fs.realpathSync(__dirname + '/../.dyn.env')
    let d = JSON.parse(
        Fs.readFileSync(p)
    )
    
    return key ? d[key] : d
}
