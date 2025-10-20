const mongoose = require("mongoose")


const provinceCitySchema = new mongoose.Schema({
  province: { type: String, required: true },
  cities: [{ type: String }],
})


module.exports = mongoose.model("ProvinceCity" , provinceCitySchema)