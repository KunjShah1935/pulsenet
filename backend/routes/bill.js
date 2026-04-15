import express from "express";
import Bill from "../models/Bill.js";

const router = express.Router();

// 🔥 ADD BILL
router.post("/add", async (req, res) => {
  try {
    const data = new Bill(req.body);
    await data.save();

    res.json({ message: "Bill added", data });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// 🔥 GET BILL
router.get("/:patientId", async (req, res) => {
  try {
    const data = await Bill.find({
      patientId: req.params.patientId
    });

    res.json(data);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

export default router;