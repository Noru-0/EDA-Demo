const Joi = require('joi');

module.exports = Joi.object({
  title: Joi.string().required(),
  date: Joi.date().required(),
});
