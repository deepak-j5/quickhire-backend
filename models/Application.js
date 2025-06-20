const mongoose = require("mongoose");

const appSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  message: String,
  resumeUrl: String,
  appliedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Application", appSchema);
