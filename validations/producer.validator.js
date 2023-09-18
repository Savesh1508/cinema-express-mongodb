const Joi = require('joi');

const producerSchema = Joi.object({
  name: Joi.string().pattern(new RegExp("^[a-zA-Z]+$")),
  description: Joi.string()
});

module.exports = producerSchema;