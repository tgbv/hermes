const Ejs = require('ejs')
const Fs = require('fs')

/*
*   helps complie ejs templates
*/
module.exports = (target, vars = {})=>{
    return Ejs.compile(
        Fs.readFileSync(`${__dirname}/../view/${target}.ejs`, {encoding: 'utf-8'})
    )(vars)
}
