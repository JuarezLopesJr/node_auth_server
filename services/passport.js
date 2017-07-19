const passport = require('passport')
const User = require('../models/user')
const config = require('../config')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const LocalStrategy = require('passport-local')

// local strategy
const localOptions = { usernameField: 'email'}
const localLogin = new LocalStrategy(localOptions, function (email, password, done) {
  User.findOne({ email: email }, function (err, user) {
    if (err) {
      return done(err)
    } else if (!user) {
      return done(null, false)
    }

    user.comparePassword(password, function (err, isMatch) {
      if (err) {
        return done(err)
      } else if (!isMatch) {
        return done(null, false)
      }
      return done(null, user)
    })

  })
})

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
}

// payload is the decoded jwt token, done is the callback
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {

  User.findById(payload.sub, function(err, user) {
    if (err) {
      return done(err, false)
    }
    if (user) {
      // null is to pass an error argument if there is one
      done(null, user)
    } else {
      // if no error, but no user found
      done(null, false)
    }

  })
})
passport.use(localLogin)
passport.use(jwtLogin)
