const Doctor = require("../models/Doctor");
const {
  createDoctorSchema,
  updateDoctorSchema,
} = require("../validation/doctorValidation");

//@desc get all doctors (Admin Only)
//@route GET /api/doctors
//@access Privet
const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    return res
      .status(200)
      .json({ message: "Doctor fetched successfully", doctors, error: false });
  } catch (error) {
    return res.status(500).json({ message: error.message, error: true });
  }
};

//@desc search for Doctors
//@route GET /api/doctors
//@access Public
const searchDoctors = async (req, res) => {
  try {
  } catch (error) {
    return res.status(500).json({ message: error.message, error: true });
  }
};

//@desc create New doctor (Admin Only)
//@route POST /api/doctors
//@access Privet
const createDoctor = async (req, res) => {
  try {
    const { error } = createDoctorSchema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ message: error.details[0].message, error: true });
    }

    const existingDoctor = await Doctor.findOne({
      "contact.email": req.body.contact.email,
    });
    if (existingDoctor) {
      return res.status(400).json({
        message: "A doctor with this email already exists",
        error: true,
      });
    }

    const newDoctor = await Doctor.create(req.body);
    res.status(201).json({
      message: "Doctor created successfully",
      doctor: newDoctor,
      error: false,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, error: true });
  }
};

//@desc Update info  doctor (Admin Only)
//@route PUT /api/doctors
//@access Privet
const updateDoctor = async (req, res) => {
  try {
    const { error } = updateDoctorSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error)
      return res.status(400).json({
        message: error.details.map((e) => e.message),
        error: true,
      });

    const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!doctor) {
      res.status(404).json({ message: "doctor not found" ,error:true});
    }

    res
      .status(200)
      .json({ message: "Doctor updated successfully", doctor, error: false });
  } catch (error) {
    return res.status(500).json({ message: error.message, error: true });
  }
};

//@desc  Delete doctor (Admin Only)
//@route DELETE /api/doctors
//@access Privet
const deleteDoctor = async (req, res) => {
  try {
    const id = req.params.id;
    const doctor = await Doctor.findByIdAndDelete(id);
    if (!doctor) {
      res
        .status(404)
        .json({ message: "The doctor is not present", error: false });
    }

    res.status(200).json({
      message: "The doctor has been successfully deleted",
      deleteDoctorId: id,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, error: true });
  }
};

module.exports = {
  getAllDoctors,
  searchDoctors,
  createDoctor,
  updateDoctor,
  deleteDoctor,
};
