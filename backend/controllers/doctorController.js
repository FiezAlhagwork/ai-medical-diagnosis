const Doctor = require("../models/Doctor");
const {
  createDoctorSchema,
  updateDoctorSchema,
} = require("../validation/doctorValidation");

const MedicalRecord = require("../models/MedicalRecord");

//@desc get all doctors (Admin Only)
//@route GET /api/doctors
//@access Privet
const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();

    if (!doctors) {
      return res.status(404).json({ message: "No doctors found", error: true });
    }
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
    const { specialty, city, province } = req.query;
    // التحقق الأساسي
    if (!specialty) {
      return res
        .status(400)
        .json({ message: "specialty is required", error: true });
    }
    let doctors = [];
    let message = "";

    // 🟢 1️⃣ البحث الكامل: اختصاص + مدينة + محافظة
    if (city && province) {
      doctors = await Doctor.find({ city, province, specialty }).lean();

      if (doctors.length > 0) {
        message = `تم العثور على أطباء ${specialty} في ${city} - ${province}`;
      }
    }

    // 🟠 2️⃣ إذا مافي، نجرب على مستوى المدينة فقط
    // if (doctors.length === 0 && city) {
    //   doctors = await Doctor.find({ specialty, city });
    //   if (doctors.length > 0) {
    //     message = `تم العثور على أطباء ${specialty} في مدينة ${city}`;
    //   }
    // }

    // 🟡 3️⃣ إذا مافي، نجرب على مستوى المحافظة فقط
    if (doctors.length === 0 && province) {
      doctors = await Doctor.find({ specialty, province }).lean();
      if (doctors.length > 0) {
        message = `تم العثور على أطباء ${specialty} في محافظة ${province}`;
      }
    }

    // 🔵 4️⃣ إذا مافي ولا بمدينة ولا محافظة، نرجع حسب الاختصاص فقط
    if (doctors.length === 0) {
      doctors = await Doctor.find({ specialty }).lean();
      if (doctors.length > 0) {
        message = `لم يتم العثور على أطباء ${specialty} في منطقتك، لكن تم العثور على أطباء بنفس الاختصاص في مناطق أخرى`;
      }
    }

    if (doctors.length === 0) {
      return res.status(404).json({
        message: `لم يتم العثور على أي طبيب اختصاص ${specialty}`,
        doctors: [],
        error: true,
      });
    }

    res.status(200).json({
      message,
      count: doctors.length,
      doctors,
      error: false,
    });
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
      res.status(404).json({ message: "doctor not found", error: true });
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

const searchDoctorAfterAi = async (req, res) => {
  try {
    const { id } = req.params;
    const diagnosis = await MedicalRecord.findById(id);

    if (!diagnosis) {
      return res
        .status(404)
        .json({ message: "Diagnosis not found", error: true });
    }

    const { matchedSpecialty } = diagnosis;
    const { city, province } = req.user;

    // التحقق الأساسي
    if (!matchedSpecialty) {
      return res
        .status(400)
        .json({ message: "specialty is required", error: true });
    }
    let doctors = [];
    let message = "";

    // 🟢 1️⃣ البحث الكامل: اختصاص + مدينة + محافظة
    if (city && province) {
      doctors = await Doctor.find({
        city,
        province,
        specialty: matchedSpecialty,
      }).lean();

      if (doctors.length > 0) {
        message = `تم العثور على أطباء ${matchedSpecialty} في ${city} - ${province}`;
      }
    }

    // 🟠 2️⃣ إذا مافي، نجرب على مستوى المدينة فقط
    // if (doctors.length === 0 && city) {
    //   doctors = await Doctor.find({ specialty, city });
    //   if (doctors.length > 0) {
    //     message = `تم العثور على أطباء ${specialty} في مدينة ${city}`;
    //   }
    // }

    // 🟡 3️⃣ إذا مافي، نجرب على مستوى المحافظة فقط
    if (doctors.length === 0 && province) {
      doctors = await Doctor.find({
        specialty: matchedSpecialty,
        province,
      }).lean();
      if (doctors.length > 0) {
        message = `تم العثور على أطباء ${matchedSpecialty} في محافظة ${province}`;
      }
    }

    // 🔵 4️⃣ إذا مافي ولا بمدينة ولا محافظة، نرجع حسب الاختصاص فقط
    if (doctors.length === 0) {
      doctors = await Doctor.find({ specialty: matchedSpecialty }).lean();
      if (doctors.length > 0) {
        message = `لم يتم العثور على أطباء ${matchedSpecialty} في منطقتك، لكن تم العثور على أطباء بنفس الاختصاص في مناطق أخرى`;
      }
    }

    if (doctors.length === 0) {
      return res.status(404).json({
        message: `لم يتم العثور على أي طبيب اختصاص ${matchedSpecialty}`,
        doctors: [],
        error: true,
      });
    }

    diagnosis.matchedDoctor = doctors.map((doc) => ({
      _id: doc._id,
      name: doc.name,
      specialty: doc.specialty,
      city: doc.city,
      province: doc.province,
    }));

    diagnosis.status = "completed";
    await diagnosis.save();

    res.status(200).json({
      message,
      count: doctors.length,
      doctors: diagnosis.matchedDoctor,
      error: false,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, error: true });
  }
};
module.exports = {
  getAllDoctors,
  searchDoctors,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  searchDoctorAfterAi,
};
