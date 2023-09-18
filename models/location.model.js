const { Schema, model } = require('mongoose');

const locationSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    region_id: {
      type: Schema.Types.ObjectId,
      ref: "Region",
      required: true
    }
  },
  {
    versionKey: false
  }
);

module.exports = model('Location', locationSchema)

