const Ejs = require('ejs')
const Fs = require('fs')
const Path = require('path')

/*
*   helps complie ejs templates
*/
module.exports = (target, vars = {})=>{

    return Ejs.compile( Fs.readFileSync(`${__dirname}/../views/${target}.ejs`, {encoding: 'utf-8'}), {
        views: [Path.resolve(__dirname, '../views')],
    })(vars)
}
