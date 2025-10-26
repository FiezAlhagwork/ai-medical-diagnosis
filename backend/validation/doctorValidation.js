const Joi = require("joi");
const { schema } = require("../models/Doctor");

const createDoctorSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  specialty: Joi.string().required(),
  province: Joi.string().required(),
  city: Joi.string().required(),
  experienceYears: Joi.number().min(0).max(60).default(0),

  contact: Joi.object({
    email: Joi.string().email().required(), 
    phone: Joi.string().min(8).max(15).required(),
    socialLinks: Joi.object({
      facebook: Joi.string().uri().allow(""),
      instagram: Joi.string().uri().allow(""),
      linkedin: Joi.string().uri().allow(""),
      portfolio: Joi.string().uri().allow(""),
    }).optional(),
  }).required(),
  rating: Joi.number().min(0).max(5).default(0),
}).options({ stripUnknown: true });

const updateDoctorSchema = createDoctorSchema.fork(
  Object.keys(createDoctorSchema.describe().keys),
  (schema) => schema.optional()
)
module.exports = {createDoctorSchema , updateDoctorSchema}
