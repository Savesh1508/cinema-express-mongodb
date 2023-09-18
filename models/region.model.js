const { Schema, model } = require('mongoose');

const regionSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
  },
  {
    versionKey: false
  }
);

module.exports = model('Region', regionSchema)

