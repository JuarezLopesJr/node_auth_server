const User = require('../models/user')
const jwt = require('jwt-simple')
const config = require('../config')
// const _ = require('lodash')

function tokenUser(user) {
  const timestamp = new Date().getTime()
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret)
}

exports.signin = function (req, res, next) {
  // this req.user is provided by the done callback from passport.js 
  res.send({ token: tokenUser(req.user)})
}

exports.signup = function(req, res, next) {
  const email = req.body.email
  const password = req.body.password

  if (!email || !password) {
    return res.status(422).send({error: 'Email or Password not provided'})
  }

  User.findOne({
    email: email
  }, function(err, existingUser) {
    if (existingUser) {
      return res.status(422).send('Email already exists')
    }

    if (err) {
      return next(err)
    }

    const user = new User({email: email, password: password})

    user.save(function(e) {
      if (e) {
        return next(e)
      }
      res.json({ token: tokenUser })
    })

  })
}

// Using lodash syntax, more clean and fast
// const body = _.pick(req.body, ['email', 'password'])

// Lodash syntax
// const user = new User(body)
//
// user.save()
//   .then(function (user) {
//     res.send({ user: user })
//   }).catch(function (e) {
//     res.status(400).send(e)
//   })
