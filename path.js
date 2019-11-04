const path = require('path')

// .join() yang berfungsi menggabungkan alamat

let uploadDirectory = path.join(__dirname, '/public/uploads')
console.log(__dirname)
console.log(uploadDirectory)

