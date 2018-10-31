const express = require("express")
const app = express()
const mongo = require("mongodb")
const port = process.env.PORT || 3000
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')

app.get('/' , (req, res) => {
    res.send("Works")
})





app.listen(port , () => {
    console.log(`listening on ${port} yaherrrd`)
})