const { Schema, model } = require('mongoose');

const clientSchema = new Schema(
  {
    name: {
      type: String,
      trim: true
    },

    phone: {
      type: String,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    hashed_password: {
      type: String,
      required: true
    },

    hashed_refresh_token: {
      type: String,
    },

    activation_link: {
      type: String
    },

    is_active: {
      type: Boolean,
      default: true,
    },
  },
  {
    versionKey: false
  }
);

module.exports = model('Client', clientSchema)

