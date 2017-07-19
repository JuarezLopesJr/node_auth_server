const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt-nodejs');

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true
  },
  password: String
})

// before saving the model
userSchema.pre('save', function(next) {
  // get access to the user model, enable the user.email and user.password
  const user = this
  // salting the password then run a callback, because salt is async
  bcrypt.genSalt(10, function(err, salt) {
    if (err) {
      return next(err)
    }
    // encrypting the password
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) {
        return next(err)
      }
      // returning the hash password, not plain text
      user.password = hash
      next()
    })
  })
})

userSchema.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) {
      return callback(err)
    }
    callback(null, isMatch)
  })
}

const User = mongoose.model('User', userSchema)

module.exports = User
