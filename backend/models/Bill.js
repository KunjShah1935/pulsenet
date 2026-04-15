import mongoose from "mongoose";

const billSchema = new mongoose.Schema({

  patientId: String,

  amount: Number,

  description: String,

  paid: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });

export default mongoose.model("Bill", billSchema);