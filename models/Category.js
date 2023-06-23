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
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('category', CategorySchema);
