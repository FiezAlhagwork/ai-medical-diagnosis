const Joi = require("joi");

const createMedicalRecordSchema = Joi.object({
  symptomsText: Joi.string().min(10).max(2000).required().messages({
    "string.empty": " symptomsText is required",
    "string.min": "The minimum text length is 10 characters.",
  }),
  quickSymptoms: Joi.array().items(Joi.string()).optional(),
  duration: Joi.string()
    .valid("أقل من يوم", "1-3 أيام", "أسبوع", "أسبوعين", "شهر", "أكثر من شهر")
    .required()
    .messages({ "any.only": "Invalid duration" }),
  severity: Joi.string()
    .valid("low", "medium", "high", "emergency")
    .required()
    .messages({ "any.only": "The risk level is invalid." }),
});

module.exports = { createMedicalRecordSchema };
