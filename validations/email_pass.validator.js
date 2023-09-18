const Joi = require('joi');

const emailPassSchema = Joi.object({
  email: Joi.string().email().message("Invalid email!").required(),
  password: Joi.string().min(6).max(25).required(),
});

module.exports = emailPassSchema;