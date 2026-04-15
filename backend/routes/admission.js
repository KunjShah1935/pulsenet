import express from "express";
import Admission from "../models/Admission.js";
import User from "../models/User.js";
import AdmissionForm from "../models/AdmissionForm.js";

const router = express.Router();

// 🥇 CREATE ADMISSION (Admin will use this)
router.post("/approve/:id", async (req, res) => {
  try {
    const form = await AdmissionForm.findById(req.params.id);

    if (!form) return res.status(404).json({ message: "Not found" });

    const { doctorId, roomNumber } = req.body;

    // ✅ update form
    form.status = "approved";
    form.selectedDoctor = doctorId;
    form.selectedRoom = roomNumber;
    await form.save();

    // 🔥 CREATE ADMISSION
    const admission = new Admission({
      patientId: form.patientId,
      doctorId,
      roomNumber,
      admissionDate: new Date(),
      diagnosis: form.chiefComplaint,
      age: form.age,
      bloodGroup: form.bloodGroup,
      admitted: true
    });

    await admission.save();

    res.json({ message: "Approved & Admission created ✅" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

router.get("/doctor/:doctorId", async (req, res) => {
  try {
    const patients = await Admission.find({
      doctorId: req.params.doctorId
    });

    res.json(patients);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.delete("/cancel/:id", async (req, res) => {
  try {
    const form = await AdmissionForm.findById(req.params.id);

    // ❌ remove admission
    await Admission.deleteOne({
      patientId: form.patientId
    });

    // optional: reset form
    form.status = "pending";
    await form.save();

    res.json({ message: "Cancelled ✅" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🥈 GET ADMISSION (for dashboard + admission page)
router.get("/:patientId", async (req, res) => {
  try {
    // 🟢 1. Get admission
    const admission = await Admission.findOne({
      patientId: req.params.patientId
    });

    if (!admission) {
      return res.status(404).json({ message: "No admission found" });
    }

    // 🟢 2. Get doctor using doctorId
    const doctor = await User.findOne({
      customId: admission.doctorId.trim() // 🔥 important
    });

    // 🟢 3. Send combined data
    res.json({
      patientId: admission.patientId,
      roomNumber: admission.roomNumber,
      diagnosis: admission.diagnosis,
      admissionDate: admission.admissionDate,
      doctorId: admission.doctorId,
      doctorName: doctor ? doctor.fullname : "Unknown"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});


// 🥉 UPDATE (optional but useful)
router.put("/:patientId", async (req, res) => {
  try {
    const updated = await Admission.findOneAndUpdate(
      { patientId: req.params.patientId },
      req.body,
      { new: true }
    );

    res.json(updated);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// 🧹 DELETE (optional)
router.delete("/:patientId", async (req, res) => {
  try {
    await Admission.findOneAndDelete({
      patientId: req.params.patientId
    });

    res.json({ message: "Admission deleted" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// APPROVE FORM
 

export default router;