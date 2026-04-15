import express from "express";
import Medication from "../models/Medication.js";

const router = express.Router();

// 🔥 ADD (MongoDB)
router.post("/add", async (req, res) => {
  try {
    const data = new Medication(req.body);
    await data.save();

    res.json({ message: "Medication added", data });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// 🔥 GET (MongoDB)
// 🔥 SPECIFIC FIRST
router.get("/doctor/:doctorId", async (req, res) => {
  try {
    const meds = await Medication.find({
      doctorId: req.params.doctorId
    });

    res.json(meds);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🔥 GENERIC AFTER
router.get("/:patientId", async (req, res) => {
  try {
    const data = await Medication.find({
      patientId: req.params.patientId
    });

    res.json(data);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
export default router;