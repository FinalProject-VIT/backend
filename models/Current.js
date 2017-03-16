var mongoose = require('mongoose');

var Current = mongoose.model('Current', {
  name: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  }
});

module.exports = { Current }


