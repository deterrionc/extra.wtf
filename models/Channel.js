const mongoose = require('mongoose');

const ChannelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  image: {
    type: String
  },
  // videos: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: 'video'
  //   }
  // ],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('channel', ChannelSchema);
