// Paragraph model
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var ParagraphSchema = new Schema({
  title: String,
  text: String,
  author: String
});

ParagraphSchema.index({ title: 'text', text: 'text'});


mongoose.model('Paragraph', ParagraphSchema);
