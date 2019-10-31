const conn = require('../connection/index')
const router = require('express').Router()

// Create user
router.post('/users',(req, res) =>{
    let {username, name, email, password} = req.body

    let sql = `INSERT INTO users(username,name,email,passwrd) 
                VALUES('${username}','${name}','${email}','${password}')`

    conn.query(sql,(err, result)=>{
        // jika terdapat error
        if(err){return res.send(err)}

        res.send(result)
    })
})