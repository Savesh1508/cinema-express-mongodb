const Joi = require('joi');

const filmSchema = Joi.object({
  name: Joi.string().required(),
  cinema_id: Joi.string().hex().length(24).required(),
  producer_id: Joi.string().hex().length(24).required(),
  description: Joi.string()
});

module.exports = filmSchema;