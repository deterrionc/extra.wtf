const mongoose = require('mongoose')

const VideoSchema = new mongoose.Schema({
  name: {
    type: String
  },
  path: {
    type: String
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'category'
  },
  date: {
    type: Date,
    default: Date.now
  },
  playedAt: {
    type: Date,
    default: new Date('2001-01-01')
  }
})

module.exports = mongoose.model('video', VideoSchema)