const mysql = require('mysql')

const conn = mysql.createConnection({
    user: 'root',
    password:'Indonesiaku!',
    host:'localhost',
    database:'bdg-mysql',
    port : 3306
})


module.exports = conn