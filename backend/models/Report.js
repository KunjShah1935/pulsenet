import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({

  patientId: String,
  doctorId: String,

  reportName: String,
  testName: String,

  date: Date,

  doctorName: String,

  status: {
    type: String,
    enum: ["ready", "pending"]
  },
  
  fileUrl: String
}, { timestamps: true });

export default mongoose.model("Report", reportSchema);