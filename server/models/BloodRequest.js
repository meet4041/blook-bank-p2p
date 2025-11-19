const mongoose = require('mongoose');

const BloodRequestSchema = new mongoose.Schema(
  {
    patientName: { type: String, required: true },
    bloodGroup: { type: String, required: true },
    unitsRequired: { type: Number, required: true },
    hospital: { type: String, required: true },
    city: { type: String, required: true },
    status: { type: String, default: "pending" }, // pending, approved, rejected
    requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("BloodRequest", BloodRequestSchema);
