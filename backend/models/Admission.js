import mongoose from "mongoose";

const admissionSchema = new mongoose.Schema({

  patientId: String,   // PT-1001
  doctorId: String,    // DR-1001

  admitted: {
    type: Boolean,
    default: false
  },

  roomNumber: String,

  admissionDate: Date,

  diagnosis: String,

  bloodGroup: String,
  age: Number

}, { timestamps: true });

export default mongoose.model("Admission", admissionSchema);