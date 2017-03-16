var mongoose = require('mongoose');

var myCart = mongoose.model('myCart', {
  id: {
    type: String,
    required: true,
    unique :true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  },
  quantity: {
    type: Number,
    default: 1
  }

});

module.exports = { myCart }
