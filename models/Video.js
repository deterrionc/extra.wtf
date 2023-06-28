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
  }
})

module.exports = mongoose.model('video', VideoSchema)