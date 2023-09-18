const { Schema, model } = require('mongoose');

const filmSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    cinema_id: {
      type: Schema.Types.ObjectId,
      ref: "Cinema",
      required: true
    },

    producer_id: {
      type: Schema.Types.ObjectId,
      ref: "Producer",
      required: true
    },

    description: {
      type: String,
    },
  },
  {
    versionKey: false
  }
);

module.exports = model('Film', filmSchema)

