const Joi = require('joi');

module.exports = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
});
