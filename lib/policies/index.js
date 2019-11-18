const joi = require('@hapi/joi');


const create = {
  body: {
    name: joi.string().required().min(2).max(100),
    skills: joi.array().items(joi.string()),
  }
};


module.exports = {
  create,
};
