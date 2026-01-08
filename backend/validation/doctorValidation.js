const PROVINCES = [
  "دمشق",
  "ريف دمشق",
  "حلب",
  "حمص",
  "حماة",
  "اللاذقية",
  "طرطوس",
  "إدلب",
  "درعا",
  "السويداء",
  "دير الزور",
  "الرقة",
  "الحسكة",
  "القنيطرة",
];

const specialty = [
  "القلب والاوعية الدموية",
  "طب أسنان",
  "طب أطفال",
  "طب عام",
  "أنف وأذن وحنجرة",
  "طوارئ",
  "أمراض الدم والأورام",
  "جراحة الكلى والمسالك البولية",
  "أمراض معدية",
  "جراحة عامة",
  "تغذية",
  "غدد صماء",
  "باطنية",
  "جراحة العظام والمفاصل",
  "معالج نفسي",
  "كلى",
  "دماغ وأعصاب",
  "روماتيزم ومفاصل",
  "جلدية وتناسلية",
  "صدرية",
  "جراحة دماغ وأعصاب وعمود فقري",
  "جراحة الأوعية الدموية",
  "سمع ونطق",
];

const Joi = require("joi");

const createDoctorSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  specialty: Joi.string().valid(...specialty).required(),
  province: Joi.string()
    .valid(...PROVINCES)
    .required(),
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
  clinicAddress:Joi.string().min(10).max(70).required(),
  education: Joi.object({
    university :Joi.string().required()
  }).required()
}).options({ stripUnknown: true });

const updateDoctorSchema = createDoctorSchema.fork(
  Object.keys(createDoctorSchema.describe().keys),
  (schema) => schema.optional()
);
module.exports = { createDoctorSchema, updateDoctorSchema };
