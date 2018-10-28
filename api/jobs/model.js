const mongoose = require('mongoose')
const { Schema } = mongoose

const jobSchema = new Schema({
  title: { type: String, required: true },
  client: { type: Schema.Types.ObjectId, required: true, ref: 'Clients' },
  tasks: [
    {
      time_start: { type: String, required: true },
      time_end: { type: String, required: true },
      user: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
      comments: { type: String, required: true }
    }
  ],
  addedBy: { type: Schema.Types.ObjectId, ref: 'Users' },
  isCompleted: { type: Boolean, default: false }
})

module.exports = mongoose.model('Jobs', jobSchema)
