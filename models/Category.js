const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  path: {
    type: String
  },
  type: {
    type: String,
    default: 'news'
  },
  channelID: {
    type: String,
  }, 
  videos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'video'
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('category', CategorySchema);
