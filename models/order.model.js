const { Schema, model } = require('mongoose');

const orderSchema = new Schema(
  {
    client_id: {
      type: Schema.Types.ObjectId,
      ref: "Client",
      required: true
    },

    cinema_id: {
      type: Schema.Types.ObjectId,
      ref: "Cinema",
      required: true
    },

    comment: {
      type: String,
    },

    price: {
      type: String,
      required: true
    },

    film_time: {
      type: Date,
      required: true
    }
  },
  {
    versionKey: false
  }
);

module.exports = model('Order', orderSchema)

