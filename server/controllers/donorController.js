const Donor = require('../models/Donor');

// Get all donors (with optional filters)
exports.getAllDonors = async (req, res) => {
  try {
    const filters = {};
    if (req.query.bloodGroup) filters.bloodGroup = req.query.bloodGroup;
    if (req.query.city) filters.city = req.query.city;

    const donors = await Donor.find(filters);
    res.json(donors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get donor by ID
exports.getDonorById = async (req, res) => {
  try {
    const donor = await Donor.findById(req.params.id);
    if (!donor) return res.status(404).json({ message: "Donor not found" });
    res.json(donor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create donor
exports.createDonor = async (req, res) => {
  try {
    const donor = new Donor({
      ...req.body,
      addedBy: req.user.id,
    });

    const saved = await donor.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update donor (PUT)
exports.updateDonor = async (req, res) => {
  try {
    const donor = await Donor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!donor) return res.status(404).json({ message: "Donor not found" });
    res.json(donor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Patch donor
exports.patchDonor = async (req, res) => {
  try {
    const donor = await Donor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!donor) return res.status(404).json({ message: "Donor not found" });
    res.json(donor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete donor
exports.deleteDonor = async (req, res) => {
  try {
    const donor = await Donor.findByIdAndDelete(req.params.id);
    if (!donor) return res.status(404).json({ message: "Donor not found" });
    res.json({ message: "Donor deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
