import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import patientRoutes from "./routes/patient.js";
import billRoutes from "./routes/bill.js";
import medRoutes from "./routes/medication.js";
import reportRoutes from "./routes/report.js";
import admissionRoutes from "./routes/admission.js";
import admissionFormRoutes from "./routes/admissionForm.js";
import adminRoutes from "./routes/admin.js";
import roomRoutes from "./routes/room.js";
import path from "path";
dotenv.config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// connect DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log(err));




app.use("/api/patient", patientRoutes);
app.use("/api/report", reportRoutes);
app.use("/api/bill", billRoutes);
app.use("/api/medication", medRoutes);
app.use("/api/admission", admissionRoutes);
app.use("/api/admission-form", admissionFormRoutes);
app.use("/api/rooms", roomRoutes);


app.use("/uploads", express.static("uploads"));
app.use("/api", adminRoutes);
app.use("/api", authRoutes);
console.log("AdmissionForm route loaded");
// start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));