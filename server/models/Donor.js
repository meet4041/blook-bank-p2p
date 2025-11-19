const mongoose = require('mongoose');

const DonorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    bloodGroup: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    city: { type: String },
    lastDonated: { type: Date },
    verified: { type: Boolean, default: false },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }  
  },
  { timestamps: true }
);

module.exports = mongoose.model('Donor', DonorSchema);
