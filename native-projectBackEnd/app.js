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
const menuSchema = new mongoose.Schema({
    item: String,
    price: Number
})

const restaurantsSchema = new mongoose.Schema({
    name: String,
    level: Number,
    menuItems: [menuSchema]
})

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    seatNumber: Number,
    order: [menuSchema]
})

const Restaurants = mongoose.model('restaurants', restaurantsSchema)
const Users = mongoose.model('users', userSchema)

app.get('/restaurants', (req,res) => {
    Restaurants.find({}, function(err, result){
        console.log(err, result)
    }).then(restaurant => res.status(201).json({restaurant}))
  })


app.get('/users', (req,res) => {
    Users.find({}, function(err, result){
        console.log(err, result)
    }).then(users => res.status(201).json({users}))
  })

app.post('/users', (req, res) =>{
    Users.create(req.body).then(user => res.status(201).json({user}))
})

app.post('/restaurants', (req, res) =>{
    Restaurants.create(req.body).then(restaurant => res.status(201).json({restaurant}))
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