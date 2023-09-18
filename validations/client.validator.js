const Joi = require('joi');

const clientSchema = Joi.object({
  name: Joi.string().pattern(new RegExp("^[a-zA-Z]+$")),
  phone: Joi.string().pattern(/\d{2}-\d{3}-\d{2}-\d{2}/),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(25).required(),
  confirm_password: Joi.valid(Joi.ref("password")).required(),
});

module.exports = clientSchema;
