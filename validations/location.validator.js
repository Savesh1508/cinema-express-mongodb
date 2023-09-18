const Joi = require('joi');

const locationSchema = Joi.object({
  name: Joi.string().pattern(new RegExp("^[a-zA-Z]+$")),
  region_id: Joi.string().hex().length(24).required()
});

module.exports = locationSchema;