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

const coordsSchema = new mongoose.Schema({
    altitudeAccuracy: Number,
    accuracy: Number,
    heading: Number,
    longitude: Number,
    altitude: Number,
    latitude: Number,
    speed: Number
})

const locationSchema = new mongoose.Schema({
    coords: coordsSchema,
    timestamp: Number
})

const sessionsSchema = new mongoose.Schema({
    sessionName: String,
    location1: locationSchema,
    location2: locationSchema,
    
})

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    userName: String,
    passWord: String,
    email: String,
})

const Sessions = mongoose.model('sessions', sessionsSchema)
const Users = mongoose.model('users', userSchema)

app.get('/sessions', (req,res) => {
    Sessions.find({}, function(err, result){
        console.log(err, result)
    }).then(session => res.status(201).json({session}))
  })

app.get('/users', (req,res) => {
    Users.find({}, function(err, result){
        console.log(err, result)
    }).then(users => res.status(201).json({users}))
  })

app.post('/sessions/:id', (req,res) => {
    var options = { upsert: true, new: true, setDefaultsOnInsert: true };
   Sessions.findOneAndUpdate({ _id: req.params.id}, req.body, options, function (err, result) {
        console.log(err)
    })
    .then(session=> res.status(201).json({ session }))
})


app.post('/users', (req, res) =>{
    Users.create(req.body).then(user => res.status(201).json({user}))
})

app.post('/sessions', (req, res) =>{
    Sessions.create(req.body).then(session => res.status(201).json({session}))
})

app.delete('/sessions/:name', (req, res) => {
    Sessions.deleteOne({ sessionName: req.params.id })
        .then(deletedSession => res.status(201).json({ deletedSession }))
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
