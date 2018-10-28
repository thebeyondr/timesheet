const mongoose = require('mongoose')
const bcrypt = require('bcrypt-nodejs')
const jwt = require('jsonwebtoken')

const { Schema } = mongoose

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  salt: String,
  hash: String,
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  }
})

UserSchema.methods.setPassword = function (password) {
  this.salt = bcrypt.genSaltSync(10)
  this.hash = bcrypt.hashSync(password, this.salt)
}

UserSchema.methods.validatePassword = function (password) {
  return bcrypt.compareSync(password, this.hash)
}

UserSchema.methods.generateJWT = function () {
  const today = new Date()
  const expirationDate = new Date(today)
  expirationDate.setDate(today.getDate() + 60)

  return jwt.sign(
    {
      email: this.email,
      id: this._id,
      exp: parseInt(expirationDate.getTime() / 1000, 10)
    },
    'secret'
  )
}

UserSchema.methods.toAuthJSON = function () {
  return {
    _id: this._id,
    email: this.email,
    name: this.name,
    address: this.address,
    token: this.generateJWT()
  }
}

module.exports = mongoose.model('Users', UserSchema)
