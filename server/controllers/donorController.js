const Donor = require('../models/Donor');

/**************************************
 * GET ALL DONORS (Public)
 **************************************/
exports.getAllDonors = async (req, res) => {
  try {
    const filters = {};
    if (req.query.bloodGroup) filters.bloodGroup = req.query.bloodGroup;
    if (req.query.city) filters.city = req.query.city;

    const donors = await Donor.find(filters)
      .populate("addedBy", "name email role");

    res.status(200).json({ success: true, data: donors });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

/**************************************
 * GET DONOR BY ID
 **************************************/
exports.getDonorById = async (req, res) => {
  try {
    const donor = await Donor.findById(req.params.id)
      .populate("addedBy", "name email role");

    if (!donor) {
      return res.status(404).json({ success: false, error: "Donor not found" });
    }

    res.status(200).json({ success: true, data: donor });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

/**************************************
 * CREATE DONOR
 * Users → unverified
 * Hospital → auto-verified for self
 **************************************/
exports.createDonor = async (req, res) => {
  try {
    let verified = false;
    let verifiedBy = null;
    let verifiedAt = null;

    let addedBy = req.user.id;

    if (req.user.role === "hospital") {
      if (req.body.addedBy) addedBy = req.body.addedBy;

      if (addedBy.toString() === req.user.id) {
        verified = true;
        verifiedBy = req.user.id;
        verifiedAt = new Date();
      }
    }

    const donor = new Donor({
      ...req.body,
      addedBy,
      verified,
      verifiedBy,
      verifiedAt
    });

    const saved = await donor.save();
    res.status(201).json({ success: true, data: saved });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

/**************************************
 * UPDATE / PATCH DONOR  
 * Users → only own donors  
 * Users → cannot modify verification fields  
 * Admin / Hospital → can update all except verification  
 **************************************/
const modifyDonor = async (req, res) => {
  try {
    const donor = await Donor.findById(req.params.id);
    if (!donor) {
      return res.status(404).json({ success: false, error: "Donor not found" });
    }

    if (req.user.role === "user") {
      if (donor.addedBy.toString() !== req.user.id) {
        return res.status(403).json({ success: false, error: "Not authorized to update this donor" });
      }
    }

    delete req.body.verified;
    delete req.body.verifiedBy;
    delete req.body.verifiedAt;

    Object.keys(req.body).forEach(key => donor[key] = req.body[key]);

    const updated = await donor.save();
    res.status(200).json({ success: true, data: updated });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.updateDonor = modifyDonor;
exports.patchDonor = modifyDonor;

/**************************************
 * DELETE DONOR  
 * User → can delete only own donors  
 * Admin / Hospital → can delete any donor  
 **************************************/
exports.deleteDonor = async (req, res) => {
  try {
    const donor = await Donor.findById(req.params.id);
    if (!donor) {
      return res.status(404).json({ success: false, error: "Donor not found" });
    }

    if (req.user.role === "user" && donor.addedBy.toString() !== req.user.id) {
      return res.status(403).json({ success: false, error: "Not authorized to delete this donor" });
    }

    await donor.deleteOne();
    return res.status(204).end();

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

/**************************************
 * VERIFY DONOR  
 * Only Hospital / Admin  
 **************************************/
exports.verifyDonor = async (req, res) => {
  try {
    if (!["hospital", "admin"].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: "Only hospital/admin can verify donors"
      });
    }

    const donor = await Donor.findById(req.params.id);
    if (!donor) {
      return res.status(404).json({ success: false, error: "Donor not found" });
    }

    donor.verified = true;
    donor.verifiedBy = req.user.id;
    donor.verifiedAt = new Date();

    const updated = await donor.save();
    res.status(200).json({ success: true, data: updated });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
