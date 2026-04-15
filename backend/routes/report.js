import express from "express";
import Report from "../models/Report.js";
import multer from "multer";
import path from "path";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });
router.post("/upload", upload.single("file"), async (req, res) => {
  try {

    const report = new Report({
      patientId: req.body.patientId,
      testName: req.body.testName,
      result: req.body.result,
      fileUrl: req.file.filename, // 🔥 store filename
      status: "completed"
    });

    await report.save();

    res.json({ message: "Report uploaded ✅" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// 🟢 CREATE TEST (doctor)
router.post("/add", async (req, res) => {
  try {
    const report = new Report({
      ...req.body,
      status: "completed" // 🔥 always completed
    });

    await report.save();

    res.json({ message: "Report uploaded ✅" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🟡 GET BY DOCTOR
router.get("/doctor/:doctorId", async (req, res) => {
  const data = await Report.find({ doctorId: req.params.doctorId });
  res.json(data);
});


// 🔵 GET PENDING (lab dashboard)
router.get("/pending", async (req, res) => {
  const data = await Report.find({ status: "pending" });
  res.json(data);
});


// 🟣 UPDATE RESULT (lab)
router.put("/update/:id", async (req, res) => {
  const updated = await Report.findByIdAndUpdate(
    req.params.id,
    {
      result: req.body.result,
      status: "completed"
    },
    { new: true }
  );

  res.json(updated);
});


// 🔵 GET BY PATIENT
router.get("/patient/:patientId", async (req, res) => {
  const data = await Report.find({ patientId: req.params.patientId });
  res.json(data);
});

router.get("/", async (req, res) => {
  const data = await Report.find().sort({ createdAt: -1 });
  res.json(data);
}); 

export default router;