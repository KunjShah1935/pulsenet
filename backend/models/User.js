// models/User.js

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

  customId: {
    type: String,
    unique: true
  },

  fullname: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },

  phone: {
    type: String
  },

  role: {
    type: String,
    enum: ["admin", "doctor", "nurse", "pharmacy", "lab", "patient"],
    required: true
  },

  password: {
    type: String,
    required: true
  }

}, { timestamps: true });

export default mongoose.model("User", userSchema);