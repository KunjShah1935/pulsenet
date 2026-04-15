import express from "express";
import User from "../models/User.js";
import Admission from "../models/Admission.js";
import AdmissionForm from "../models/AdmissionForm.js";

const router = express.Router();

router.get("/dashboard", async (req, res) => {
  try {
    const totalPatients = await User.countDocuments({ role: "patient" });
    const doctors = await User.countDocuments({ role: "doctor" });
    const nurses = await User.countDocuments({ role: "nurse" });

    const activeAdmissions = await Admission.countDocuments();

    const pending = await AdmissionForm.countDocuments({ status: "pending" });
    const approved = await AdmissionForm.countDocuments({ status: "approved" });

    const recent = await Admission.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalPatients,
      doctors,
      nurses,
      activeAdmissions,
      pending,
      approved,
      recent
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

export default router;