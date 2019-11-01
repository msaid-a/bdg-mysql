const nodemailer = require('nodemailer')
const config = require('./config')


let sendMail = (email) =>{


let transpoter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        type: 'OAuth2',
        user: 'muhammadsaidarrafi@gmail.com',
        clientId: config.clientId,
        clientSecret: config.clientSecret,
        refreshToken : config.refreshToken
    }
})

let mail = {
    from : 'Muhammad Said Arrafi <muhammadsaidarrafi@gmail.com>',
    to: email,
    subject: 'Selamat Datang',
    html:`<h1> Hello gengs</h1>`
}

transpoter.sendMail(mail, (err,result)=>{
    if(err) return console.log(err)

    console.log('Email Berhasil di kirim')
})
}

module.exports = sendMail