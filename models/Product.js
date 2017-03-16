var mongoose = require('mongoose');

let Product = mongoose.model('Product', {
  id: {
    type: String,
    default: null
  },
  name: {
    type: String
  },

  description: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  price: {
    type: Number,
    default: null
  },
  rating: {
    type: Number,
    default: null
  },
  image: {
    type: String,
    required: true,
    minlength: 1,
  }
})

module.exports = { Product };
