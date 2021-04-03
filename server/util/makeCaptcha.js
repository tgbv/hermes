const Captcha = require('svg-captcha')

module.exports = ()=>{
    let text = Captcha.randomText(5)
    let svg = Captcha(text, {
        width: 200,
        height: 100,
        noise: 10,
    })

    return {text, svg}
}
