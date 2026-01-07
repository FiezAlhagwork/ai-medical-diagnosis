const Joi = require("joi");

const registerValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(20).required(),
    email: Joi.string().email().optional(),
    phone: Joi.string()
      .regex(/^\+9639\d{8}$/)
      .required()
      .messages({
        "string.pattern.base":
          "Phone number must be in international format (e.g. +9639XXXXXXX)",
      }),
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
    phone: Joi.pattern(/^\+[1-9]\d{10,14}$/)
      .required()
      .messages({
        "string.pattern.base":
          "Phone number must be in international format (e.g. +9639XXXXXXX)",
      }),
    password: Joi.string().min(6).required(),
  });
  return schema.validate(data);
};

module.exports = { registerValidation, loginValidation };
