const Joi = require("joi");

const registerValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(20).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(100).required(),
    gender: Joi.string().valid("ذكر", "أنثى").optional(),
    age: Joi.number().min(1).max(120).optional(),
    city: Joi.string().required(),
    province: Joi.string().required(),
  });

  return schema.validate(data);
};

const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });
  return schema.validate(data);
};



module.exports = {registerValidation , loginValidation}