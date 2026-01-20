const MedicalRecord = require("../models/MedicalRecord");
const {
  createMedicalRecordSchema,
} = require("../validation/medicalValidation");
const { main } = require("../services/aiServices");
const Doctor = require("../models/Doctor");
const { sanitizeResultString } = require("../util/index");
const mongoose = require("mongoose");
const createDiagnosis = async (req, res) => {
  try {
    const { error, value } = createMedicalRecordSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        message: "Data verification failed",
        details: error.details.map((e) => e.message),
        error: true,
      });
    }

    const { gender, age } = req.user;
    const { symptomsText, quickSymptoms, duration, severity } = value;

    console.log(gender, age);

    const prompt = `

أنت مساعد طبي ذكي ومحترف، مختص فقط بالاستشارات الطبية. تعتبر نفسك خبير في التخصصات التالية فقط:
[
"القلب والاوعية الدموية",
"طب اسنان",
"طب اطفال",
"طب عام",
"الانف والاذن و الحنجرة",
"طوارى",
"امراض الدم والاورام",
"طب عيون",
"جراحة الكلى والمسالك البولية والذكور والعقم",
"الامراض المعدية",
"جراحة عامة",
"تغذية",
"الغدد الصماء",
"باطنية",
"جراحة العظام والمفاصل",
"معالج نفسي",
"الكلى",
"دماغ واعصاب",
"الروماتيزم والمفاصل",
"الجلدية والتناسلية",
"صدرية",
"امراض الجهاز التنفسي",
"جراحة دماغ واعصاب وعمود فقري",
"جراحة الاوعية الدموية",
"سمع ونطق"
]

القواعد:

1) اقرأ الأعراض التالية بعناية: 
الأعراض: "${symptomsText}"
أعراض إضافية: [${quickSymptoms?.join(", ") || "لا يوجد"}]
المدة: ${duration}
مستوى الخطورة الملاحظ من المستخدم: ${severity}
العمر: ${age || "غير محدد"}
الجنس: ${gender || "غير محدد"}

2) اختر من بين الاختصاصات أعلاه فقط، ولا تستخدم أي تخصص آخر.

3) أعد الرد بصيغة JSON فقط، بالهيكل التالي:

{
  "doctor_name": "<أحد التخصصات فقط من القائمة أعلاه>",
  "possible_condition": "<التشخيص الأكثر احتمالاً (اسم الحالة المرضية)>",
  "confidence": "<نسبة الثقة بالتشخيص %>",
  "severity": "<مستوى الخطورة: بسيط / متوسط / عالي / حالة طارئة>",
  "advice": "<نصيحة أمان أو إجراء فوري إن وجد>",
  "next_step": "<الإجراء المقترح التالي مثل: زيارة طبيب باطنة، إجراء فحص دم، راحة تامة...>"
}

4) إذا لم تنطبق الأعراض على أي من الاختصاصات المذكورة، أعد JSON بهذا الشكل فقط:
{
  "doctor_name": "لا يوجد",
  "possible_condition": "التشخيص غير محدد ضمن التخصصات المتاحة",
  "confidence": "100%",
  "severity": "لا ينطبق",
  "advice": "يرجى مراجعة طبيب عام لتقييم الحالة.",
  "next_step": "زيارة طبيب أسرة للحصول على تقييم أولي."
}

5) لا تكتب أي نص خارج JSON. التزم تمامًا بالهيكل المذكور أعلاه.
6) كن دقيقًا ومهنيًا في اختيار الاختصاص والمرض المحتمل بناءً على الأعراض.
`;

    const aiResult = await main(prompt);

    const aiJson = sanitizeResultString(aiResult);

    const diagnosis = await MedicalRecord.create({
      userId: req.user._id,
      symptomsText,
      quickSymptoms,
      duration,
      matchedSpecialty: aiJson.doctor_name,
      severity: aiJson.severity,
      confidence: aiJson.confidence,
      next_step: aiJson.next_step,
      advice: aiJson.advice,
      possible_condition: aiJson.possible_condition,
    });

    console.log(diagnosis);

    res.status(201).json({
      message: "Diagnosis created successfully",
      error: false,
      data: diagnosis,
    });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

const getAllDiagnoses = async (req, res) => {
  try {
    let diagnosis;
    if (req.user.role === "admin") {
      diagnosis = await MedicalRecord.find({})
        .populate("userId", "name email")
        .sort({ createdAt: -1 });
    } else {
      diagnosis = await MedicalRecord.find({ userId: req.user._id }).select("possible_condition createdAt confidence").sort({
        createdAt: -1,
      });
    }

    if (!diagnosis || diagnosis.length === 0) {
      return res.status(404).json({
        message: "There are no diagnoses at this time.",
        count: 0,
        diagnoses: [],
        error: false,
      });
    }

    res.status(200).json({
      message: "The diagnoses were successfully obtained.",
      count: diagnosis.length,
      diagnosis,
      error: false,
    });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

const getDiagnosisById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID", error: true });
    }

    const diagnosis = await MedicalRecord.findById(id);
    if (!diagnosis) {
      return res
        .status(404)
        .json({ message: "There are no diagnoses at this time.", error: true });
    }
    if (
      req.user.role !== "admin" &&
      diagnosis.userId._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "You are not authorized to view this diagnosis",
        error: true,
      });
    }

    res.status(200).json({
      message: "The diagnosis was successfully obtained",
      data: diagnosis,
      error: false,
    });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

const deleteDiagnosis = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID", error: true });
    }

    const diagnosis = await MedicalRecord.findById(id);
    if (!diagnosis) {
      return res
        .status(404)
        .json({ message: "There are no diagnoses at this time.", error: true });
    }
    if (
      req.user.role !== "admin" &&
      diagnosis.userId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "You are not authorized to view this diagnosis",
        error: true,
      });
    }

    // const isOwner = diagnosis.userId.toString() !== req.user._id.toString();
    // const isAdmin = req.user.role !== "admin";

    // if (isOwner && isAdmin) {
    //   return res.status(403).json({
    //     message: "You are not authorized to view this diagnosis",
    //     error: true,
    //   });
    // }

    await diagnosis.deleteOne();

    res.status(200).json({
      message: "The diagnosis was successfully deleted",
      deletedId: id,
      error: false,
    });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

module.exports = {
  createDiagnosis,
  getAllDiagnoses,
  getDiagnosisById,
  deleteDiagnosis,
};
