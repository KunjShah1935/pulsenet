import express from "express";
import Room from "../models/Room.js";
import Admission from "../models/Admission.js";

const router = express.Router();

// 🔥 GET ROOMS WITH OCCUPANCY
router.get("/", async (req, res) => {
  try {
    const rooms = await Room.find();

    const result = await Promise.all(
      rooms.map(async (room) => {
        const occupied = await Admission.countDocuments({
          roomNumber: room.number
        });

        return {
          number: room.number,
          type: room.type,
          beds: room.beds,
          occupied
        };
      })
    );

    res.json(result);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/add", async (req, res) => {
  try {
    const room = new Room(req.body);
    await room.save();

    res.json({ message: "Room added ✅", room });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;