var mongoose = require('mongoose');

var Users = new mongoose.Schema({
  username : { type: String, required: true, unique: true },
  email    : { type: String, required: true, unique: true },
  password : { type: String, required: true },
  name: String,
  contact: Number
});

mongoose.model('Users', Users);
