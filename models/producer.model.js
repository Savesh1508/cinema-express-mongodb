const { Schema, model } = require('mongoose');

const producerSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
    },
  },
  {
    versionKey: false
  }
);

module.exports = model('Producer', producerSchema)

