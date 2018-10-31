require('dotenv').config()
const express = require("express")
const app = express()
const port = process.env.PORT || 3000
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')

app.disable('x-powered-by')
app.use(bodyParser.json())
app.use(cors())

app.use(function (err, req, res, next) {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        console.error('Bad JSON');
    }
})

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true
});

app.get('/ping', (req,res) => {
    res.send('PONG!')
  })
  
  app.use((err,req,res,next)=>{
    res.status(err.status || 500).json({error:err})
  })
  app.use((req,res,next)=>{
    res.status(404).json({error: {message: 'Not Found!'}})
  })




app.listen(port , () => {
    console.log(`listening on ${port} yaherrrd`)
})