import mongoose from "mongoose";

const medicationSchema = new mongoose.Schema({

  patientId: String,

  medicineName: String,
  dosage: String,

  frequency: String,

  instructions: String,

  time: String, // 🔥 added

  doctorId: String,
  doctorName: String,

  status: {
    type: String,
    enum: ["pending", "taken", "upcoming"]
  },

  startDate: Date,
  endDate: Date

}, { timestamps: true });

export default mongoose.model("Medication", medicationSchema);