import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({

  // 🔗 link with user
  userId: String,

  // optional: store customId also (easy access)
  customId: String, // PT-1001

  fullname: {
    type: String,
    required: true
  },

  age: Number,

  gender: {
    type: String,
    enum: ["male", "female", "other"]
  },

  phone: String,

  address: String,

  bloodGroup: String,

  doctorId: String, // DR-1001

  admitted: {
    type: Boolean,
    default: false
  },

  roomNumber: String,

  diagnosis: String

}, { timestamps: true });

export default mongoose.model("Patient", patientSchema);