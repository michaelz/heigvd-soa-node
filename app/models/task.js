// task model

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var TaskSchema = new Schema({
  user_id: mongoose.Schema.Types.ObjectId,
  description: String
});

mongoose.model('Task', TaskSchema);
