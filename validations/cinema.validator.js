const Joi = require('joi');

const cinemaSchema = Joi.object({
  name: Joi.string().required(),
  capacity: Joi.number().positive(),
  location_id: Joi.string().hex().length(24).required(),
  phone: Joi.string().pattern(/\d{2}-\d{3}-\d{2}-\d{2}/).required(),
});

module.exports = cinemaSchema;