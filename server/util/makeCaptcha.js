const Captcha = require('svg-captcha')

module.exports = ()=>{

    let data = Captcha.create({
        charPreset: 'abcdefghjkmnopqrstuvwxyzABCDEFGHJKMNOPQRSTUVWXYZ0123456789',
        width: 200,
        height: 100,
        noise: 10,
        size: 5,
        ignoreChars: 'Il',
    })

    return {text: data.text, svg: data.data}
}
