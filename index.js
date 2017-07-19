// modules imports
const express = require('express')
const http = require('http')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const mongoose = require('mongoose')

// DB setup
mongoose.connect('mongodb://localhost/auth', {
  useMongoClient: true
})

// app setup
const app = express()
const port = process.env.PORT || 3000
const server = http.createServer(app)
const router = require('./router');

// express middlewares
app.use(morgan('combined')) // log framework for debugging
app.use(bodyParser.json({ type: '*/*' }))
app.use(express.static('server'))
app.set('view engine', 'js')

// getting routes from router.js, cleaner than set app.get() inside here
router(app)

// server setup
server.listen(port)
console.log('Server running on port:', port)
