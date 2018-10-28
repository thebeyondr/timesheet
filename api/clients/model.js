const mongoose = require('mongoose')
const { Schema } = mongoose

const clientSchema = new Schema({
  name: { type: String, required: true, unique: true },
  managerName: { type: String, required: true },
  managerPosition: { type: String, required: true }
})

module.exports = mongoose.model('Clients', clientSchema)
