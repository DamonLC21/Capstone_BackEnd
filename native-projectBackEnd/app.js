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

app.post('/users', (req, res) =>{
    Users.create(req.body).then(user => res.status(201).json({user}))
})

app.post('/sessions', (req, res) =>{
    Sessions.create(req.body, function (err, result) { 
        console.log(err,result)}).then(session => res.status(201).json({session}))
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


const placeObject = (yourlocation, mylocation, isMiles,) =>{ 
      
    function toRad(x) {
        return x * Math.PI / 180;
      }
     
      var lon1 = yourlocation.lng;
      var lat1 = yourlocation.lat;
     
      var lon2 = mylocation.lng;
      var lat2 = mylocation.lat;
     
      var R = 6371; // km
     
      var x1 = lat2 - lat1;
      var dLat = toRad(x1);
      var x2 = lon2 - lon1;
      var dLon = toRad(x2)
      var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      var d = R * c;
    
     
      if(isMiles) d /= 1.60934;
      x1 = x1 * 1609.344
      x2 = x2 * 1609.344 
      d = d * 1609.344
     
      return [x1, x2, d]
  }

  console.log(placeObject({lat:39.75751913899073,lng:-105.00692868825644},{lat:39.75747517814582755,lng:-105.00690361273335},true))