const mongoose = require('mongoose');

const ChannelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  image: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('channel', ChannelSchema);
