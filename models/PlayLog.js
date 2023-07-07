const mongoose = require('mongoose');

const PlayLogSchema = new mongoose.Schema({
  video: {
    type: String,
    required: true
  },
  category: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  ip: {
    type: String
  },
  browser: {
    type: String
  },
  os: {
    type: String
  }
});

module.exports = mongoose.model('playlog', PlayLogSchema);
