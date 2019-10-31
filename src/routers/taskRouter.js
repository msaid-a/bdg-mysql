const conn = require('../connection/index')
const router = require('express').Router()

// Get All Atask

// Get All on task

// Get Task By ID

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

// Detele Task


module.exports = router