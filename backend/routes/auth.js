import express from "express";
import User from "../models/User.js";

const router = express.Router();
// routes/auth.js



function generateCustomId(role, count) {
  const prefixMap = {
    admin: "AD",
    doctor: "DR",
    nurse: "NR",
    patient: "PT",
    pharmacy: "PH",
    lab: "LB"
  };

  const prefix = prefixMap[role] || "US";
  return `${prefix}-${count}`;
}

// 🔥 SIGNUP
router.post("/signup", async (req, res) => {
  const { fullname, email, password, role, phone } = req.body;

  try {
    const existing = await User.findOne({ email });

    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 🔥 FAST ID GENERATION (FIXED)
    const lastUser = await User.findOne({ role }).sort({ createdAt: -1 });

    let count = 1000;

    if (lastUser && lastUser.customId) {
      const num = parseInt(lastUser.customId.split("-")[1]);
      count = num + 1;
    }

    const customId = generateCustomId(role, count);

    const newUser = new User({
      customId,
      fullname,
      email,
      password,
      role,
      phone
    });

    await newUser.save();

    res.json({
      message: "Signup successful",
      user: {
        id: customId,
        fullname,
        role
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.json({
      id: user.customId,
      fullname: user.fullname,
      role: user.role
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET all doctors
router.get("/doctors", async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" });

    res.json(doctors);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🔥 GET USER BY ID

router.get("/staff", async (req, res) => {
  try {
    const users = await User.find({
      role: { $nin: ["patient", "admin"] }
    });
    
    res.json(users);
    
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findOne({
      customId: req.params.id
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.delete("/user/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted ✅" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;