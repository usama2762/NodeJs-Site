var mongoose = require('mongoose');

var product = new mongoose.Schema({
  pid:String,
  accepted: Boolean
});

var Artist = new mongoose.Schema({
  username : { type: String, required: true, unique: true },
  email    : { type: String, required: true, unique: true },
  password : { type: String, required: true },
  name:String,
  contact: Number,
  song_type: String,
  band: String,
  songs: {
    1:String,
    2:String,
    3:String,
    4:String,
    5:String,
    6:String,
    7:String,
    8:String
  },
  products: [product]
});

mongoose.model('Artist', Artist);
