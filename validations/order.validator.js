const Joi = require('joi');

const orderSchema = Joi.object({
  client_id: Joi.string().hex().length(24).required(),
  cinema_id: Joi.string().hex().length(24).required(),
  comment: Joi.string(),
  price: Joi.number().positive().required(),
  film_time: Joi.date().greater('now')
});

module.exports = orderSchema;
