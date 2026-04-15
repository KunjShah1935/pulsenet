import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  number: String,
  type: String,
  beds: Number
}, { timestamps: true });

export default mongoose.model("Room", roomSchema);