const mongoose = require('mongoose');

const BloodRequestSchema = new mongoose.Schema(
  {
    patientName: { type: String, required: true },
    bloodGroup: { type: String, required: true },
    unitsRequired: { type: Number, required: true },
    hospital: { type: String, required: true },
    city: { type: String, required: true },

    requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    status: {
      type: String,
      enum: ["pending", "approved"],
      default: "pending"
    },

    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },

    processedAt: { type: Date },
    hospitalNote: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model("BloodRequest", BloodRequestSchema);
