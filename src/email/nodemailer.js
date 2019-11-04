const nodemailer = require('nodemailer')
const config = require('./config')


let sendMail = (data) =>{


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
    to: data.email,
    subject: 'Selamat Datang',
    html:`<h1> Hello, Welcome ${data.name}</h1>
    <a href="http://localhost:2222/verifivation/${data.username}">Click Here to verification</a>`
}

transpoter.sendMail(mail, (err,result)=>{
    if(err) return console.log(err)

    console.log('Email Berhasil di kirim')
})
}

module.exports = sendMail