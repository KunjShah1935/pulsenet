import express from "express";
import Patient from "../models/Patient.js";
import User from "../models/User.js";

const router = express.Router();

// 🔥 ADD PATIENT
router.post("/add", async (req, res) => {
  try {
    const { userId, ...rest } = req.body;

    // get user (to fetch customId)
    const user = await User.findOne({ customId: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newPatient = new Patient({
      userId,
      customId: user.customId, // PT-1001
      ...rest
    });

    await newPatient.save();

    res.json({
      message: "Patient added successfully",
      patientId: user.customId
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// 🔥 GET PATIENT DASHBOARD DATA
router.get("/:userId", async (req, res) => {
    console.log("GET route hit");
  try {
    const { userId } = req.params;

    const patient = await Patient.findOne({ userId });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.json(patient);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

export default router;