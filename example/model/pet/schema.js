const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const petSchema = new Schema({
  title: { type: String, required: true },
  body: { type: String }
});

module.exports = petSchema;
