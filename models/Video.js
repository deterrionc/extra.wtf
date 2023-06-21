const mongoose = require('mongoose')

const VideoSchema = new mongoose.Schema({
  name: {
    type: String
  },
  path: {
    type: String
  },
  channel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'channel'
  }
})

module.exports = mongoose.model('video', VideoSchema)