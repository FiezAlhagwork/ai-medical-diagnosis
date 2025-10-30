const Joi = require("joi");
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

const locationSchema = Joi.object({
  province: Joi.string()
    .valid(...PROVINCES)
    .required(),
  cities: Joi.array().items(Joi.string().min(2).max(100)).min(1).required(),
});


module.exports = locationSchema