const conn = require('../connection/index')
const router = require('express').Router()
const validator = require('validator')
const bcryptjs = require('bcryptjs')
// Create user v1
router.post('/usersv1',(req, res) =>{
    let {username, name, email, password} = req.body

    let sql = `INSERT INTO users(username,name,email,password) 
                VALUES('${username}','${name}','${email}','${password}')`

    conn.query(sql,(err, result)=>{
        // jika terdapat error
        if(err){return res.send(err)}

        res.send(result)
    })
})

// Crete user v2
router.post('/users', (req,res) => {
    let sql = `INSERT INTO users SET ?`
    let sql2 = `SELECT * FROM users`
    let data = req.body

    if(!validator.isEmail(data.email)){
        return res.send({error:'is not email'})
    }
    data.password = bcryptjs.hashSync(data.password, 8)

    conn.query(sql,data, (err,result) => {
        if(err) return res.send(err)
        conn.query(sql2,(err, result) => {
            if(err) return res.send(err)            
            res.send(result)
        })
    })
})

// get all useres
router.get('/users' ,(req,res) => {
    let sql = `SELECT * FROM users`
    conn.query(sql, (err, result) =>{
        if(err) return res.send(err)
        res.send(result)
    })
    
})

// Update user
router.patch('/users/:userid', (req,res) => {
    let sql = `UPDATE users SET ? WHERE id = ?`
    let data = [req.body, req.params.userid]
    conn.query(sql,data, (err,result) =>{
        if(err) return res.send(err)
        res.send(result)
    })
})


// Delete User 
router.delete('/users/:userid', (req,res) => {
    let sql = `DELETE FROM users WHERE id = ${req.params.userid}`
    conn.query(sql, (err,result) => {
        if(err) return res.send(err)
        res.send(result)
    })
})

// Login user (email,password)
/* 
    Login dengan email dan password nya 
        -user not founf
    result = object user
*/

router.post('/users/login', (req,res) => {
    let {email,password} = req.body
    
    let sql = `SELECT * FROM users Where email = '${email}'`
    
    conn.query(sql, async (err,result) =>{
        if(err) return res.send(err)
        
        if(result.length === 0 ) return res.send({err:"user not found"})
        
        let user = result[0]

        let hash = await bcryptjs.compare(password,user.password)
        if(!hash) return res.send({err:'Wrong password'})
        res.send(user)

        })


})


module.exports = router