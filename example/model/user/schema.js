const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const userSchema = new Schema({
  title: { type: String, required: true },
  body: { type: String }
});

module.exports = userSchema;
