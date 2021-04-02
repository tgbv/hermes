/*
*   copy/paste from https://www.w3schools.com/nodejs/ref_crypto.asp
    don't have time to bother with crypto API
*/
const crypto = require('crypto');
const crs = require('crypto-random-string')

module.exports = {

    generate(User){
        const {id, apikeysalt} = User

        var mykey = crypto.createCipher('aes-256-ecb', process.env.APP_KEY);
        var mystr = mykey.update(JSON.stringify({ id, apikeysalt }), 'utf8', 'hex')
                    mystr += mykey.final('hex');

        return mystr
    },

    decode(str){
        var mykey = crypto.createDecipher('aes-256-ecb', process.env.APP_KEY);
        var mystr = mykey.update(str, 'hex', 'utf8')
            mystr += mykey.final('utf8');

        return JSON.parse(mystr)
    },

    makeSalt(){
        return crs({length:8, type: 'ascii-printable'})
    }

}
