// Paragraph model
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var ParagraphSchema = new Schema({
  title: String,
  text: String,
  author: String
});

mongoose.model('Paragraph', ParagraphSchema);
