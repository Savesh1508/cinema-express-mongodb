const Joi = require('joi');

const regionSchema = Joi.object({
  name: Joi.string().pattern(new RegExp("^[a-zA-Z]+$")),
});

module.exports = regionSchema;