const { Schema, model } = require('mongoose');

const cinemaSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    capacity: {
      type: Number
    },

    location_id: {
      type: Schema.Types.ObjectId,
      ref: "Location",
      required: true
    },

    phone: {
      type: String,
      required: true,
      trim: true
    },
  },
  {
    versionKey: false
  }
);

module.exports = model('Cinema', cinemaSchema)

