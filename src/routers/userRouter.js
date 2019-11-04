const conn = require('../connection/index')
const router = require('express').Router()
const validator = require('validator')
const bcryptjs = require('bcryptjs')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
// const nodemailer = require('nodemailer')
const sendMail = require('../email/nodemailer')
const uploadDirectory = path.join(__dirname,'../../public/uploads')

// menentukan dimana file akan di simpan dan bagaimana foto tersebut di beri nama
const _storage = multer.diskStorage({
    // menentukan folder penyimpana file
    destination : function(req, file, cb){
        cb(null,uploadDirectory)
    },
    filename: function(req,file,cb){
        cb(null, Date.now()+file.fieldname + path.extname(file.originalname))
    }
})


const upload = multer({
    storage : _storage,
    limits : {
        fileSize : 1000000 //Byte, max 1MB
    },
    fileFilter(req, file , callback){
        if(!file.originalname.match(/\.(jpg|jpeg|png|JPG|JPEG|PNG)$/)){
            callback(new Error ('Format file harus jpg/jpeg/png'))
        }

        callback(null, true)
    }
})
// POST AVATAR
router.post('/avatar/:userid',upload.single('avatar'), (req,res)=>{

    const sql = `SELECT * FROM users WHERE id='${req.params.userid}'`
    const sql2 = `UPDATE users SET avatar = '${req.file.filename}' WHERE id = '${req.params.userid}'`

    // cari user berdasarkan userid
    conn.query(sql, (err,result) => {
        if(err){return res.send({err})}
        if(result.length === 0) return res.send({err:"user not found"})
        // simpan nama photo yang baru di upadere
        conn.query(sql2, (err,result)=>{
            if(err){return res.send({err})}
            res.send({filename: req.file.filename})
        })
    })

}, (err,req,res,next)=>{
    if(err) return res.send(err)
})

// get Avatar 
router.get('/avatar/:fileName', (req,res)=>{
    // letak folder
    let letak = {
        root : uploadDirectory
    }
    // nama File
    let fileName = req.params.fileName


    res.sendFile(fileName, letak, function(err){
        if(err) return res.send(err)
    })

})


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
        sendMail(data)

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
        if(!user.verified) return res.send({err:"User Not verification"})
        res.send(user)

        })


})

// Verification
router.get('/verifivation/:username', (req,res) => {
    let sql = `UPDATE users SET  verified = true WHERE username = '${req.params.username}'`
    conn.query(sql, (err, result)=> {
        if (err) return res.send(err)
        res.send(result)
    })
})



module.exports = router