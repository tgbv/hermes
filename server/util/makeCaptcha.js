const Captcha = require('svg-captcha')

module.exports = (size = 5)=>{

    let data = Captcha.create({
        charPreset: 'abcdefghjkmnopqrstuvwxyzABCDEFGHJKMNOPQRSTUVWXYZ0123456789',
        width: 200,
        height: 100,
        noise: 10,
        ignoreChars: 'Il',
        size,
    })

    return {text: data.text, svg: data.data}
}
