// User model

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: String,
  password: String,
  bookmarks: Object
});

mongoose.model('User', UserSchema);
