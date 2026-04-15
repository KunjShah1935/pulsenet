import mongoose from "mongoose";

const admissionFormSchema = new mongoose.Schema({

  // 🔗 Link to user
  patientId: String,

  // 🟢 STEP 1: Personal Info
  fullname: String,
  dob: String,
  age: Number,
  gender: String,
  bloodGroup: String,
  phone: String,
  email: String,
  address: String,

  // 🟡 STEP 2: Emergency
  emergencyName: String,
  relationship: String,
  emergencyPhone: String,
  alternatePhone: String,

  // 🔵 STEP 3: Medical History
  conditions: String,
  surgeries: String,
  currentMedications: String,
  allergies: String,

  // 🔴 STEP 4: Symptoms
  chiefComplaint: String,
  symptoms: String,
  duration: String,
  severity: String,

  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  }

}, { timestamps: true });

export default mongoose.model("AdmissionForm", admissionFormSchema);