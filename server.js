const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const session = require('express-session')
const cors = require('cors')
const mongoose = require('mongoose')
const errorHandler = require('errorhandler')
require('dotenv').config()

const server = express()

server.use(cors())
server.use(require('morgan')('dev'))
server.use(bodyParser.urlencoded({ extended: false }))
server.use(bodyParser.json())
server.use(express.static(path.join(__dirname, 'public')))
server.use(
  session({
    secret: 'vertistechnologies',
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false
  })
)

// Configure mongoose's promise to global promise
mongoose.promise = global.Promise

// DB Config
const db = process.env.MONGO_URI

// Connect DB
mongoose
  .connect(db, { useCreateIndex: true, useNewUrlParser: true })
  .then(() => console.log('> Database connected'))
  .catch(err => console.log(err))
mongoose.set('debug', true)

// Models
require('./api/users/model')
require('./api/jobs/model')
require('./api/clients/model')
// !Seed DB
// !require('./seeds')
// Passport
require('./config/passport')
// Routes
server.use(require('./api'))

// Configure isProduction variable
const isProduction = process.env.NODE_ENV === 'production'

// If none of these routes are hit, serve static files
if (isProduction) {
  // Set static folder
  server.use(express.static('client/build'))

  // Send static files
  server.get('/*', (req, res) => {
    res.sendFile(path.resolve(__dirname, './client/build', 'index.html'))
  })
}

if (!isProduction) {
  server.use(errorHandler())
}

// Error handlers & middlewares
if (!isProduction) {
  server.use((req, res, next, err) => {
    const code = err.status || 500
    res.status(code).json({
      errors: {
        message: err.message,
        error: err
      }
    })
  })
}

server.use((req, res, next, err) => {
  res.status(err.status || 500)

  res.json({
    errors: {
      message: err.message,
      error: {}
    }
  })
})

server.listen(process.env.PORT || 5000, () =>
  console.log(`Server running on http://localhost:${process.env.PORT || 5000}/`)
)
