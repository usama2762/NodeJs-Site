var mongoose = require('mongoose');

var Product = new mongoose.Schema({
  username : { type: String, required: true},
  name: {type: String, required: true},
  cost: Number,
  img: String,
  url:String
});

mongoose.model('Products', Product);
