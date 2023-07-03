const path = require('path')
const express = require('express')
const app = express()


const port = process.env.PORT || 8888
const publicDirectoryPath = path.join(__dirname,'../public')
app.use(express.static(publicDirectoryPath))



app.listen(port, () => console.log(`Example app listening on port ${port}!`))