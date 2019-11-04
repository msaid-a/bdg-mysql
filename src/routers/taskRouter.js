const conn = require('../connection/index')
const router = require('express').Router()

// Get All task
router.get('/tasks', (req,res) => {
    let sql = `SELECT *  FROM task`
    conn.query(sql, (err, result) => {
        if(err) return res.send(err.sqlMessage)
        res.send(result)
    })
})

// Get All own task
router.get('/owntasks/:userid', (req,res)=>{
    let sql = `SELECT * FROM task WHERE user_id ='${req.params.userid}'`
    conn.query(sql, (err,result)=>{
        if(err) return res.send(err.sqlMessage)
        res.send(result)
    })
})

// Get Task By ID
router.get('/tasks/:idtask', (req,res)=>{
    let sql = `SELECT * FROM task WHERE id=${req.params.idtask}`
    conn.query(sql, (err,result) =>{
        if(err) return res.send(err)
        res.send(result)
    })
})

// Create task
router.post('/tasks', (req,res) => {
    let sql = `INSERT INTO task SET ?`
    let sql2 = `SELECT * FROM task`
    let data = req.body

    conn.query(sql, data, (err, result) => {
        if(err) return res.send(err.sqlMessage)
        conn.query(sql2, (err, result) => {
            if(err) return res.send(err.sqlMessage)
            res.send(result)
        })
    })
})
// Update Task
router.patch('/tasks/:idtask', (req,res) =>{
    let sql = `UPDATE task SET ? WHERE id = ?`
    let data = [req.body, req.params.idtask]
        
    conn.query(sql, data, (err,result) => {
        if(err) return res.send(err.sqlMessage)
        res.send(result)
    })
})


// Detele Task
router.delete('/tasks/:idtask', (req,res) => {
    let sql = `DELETE FROM task WHERE id = ${req.params.idtask}`
    conn.query(sql, (err,result) => {
        if(err) return res.send(err)
        res.send(result)
    })
})  


module.exports = router