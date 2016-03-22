// task model
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var TaskSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User' },
  description: String
});

mongoose.model('Task', TaskSchema);
