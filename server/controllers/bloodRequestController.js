const BloodRequest = require('../models/BloodRequest');

// Create a new blood request
exports.createBloodRequest = async (req, res) => {
  try {
    const request = new BloodRequest({
      ...req.body,
      requestedBy: req.user.id
    });

    const saved = await request.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all requests (admin or public)
exports.getAllRequests = async (req, res) => {
  try {
    const filters = {};
    if (req.query.bloodGroup) filters.bloodGroup = req.query.bloodGroup;
    if (req.query.city) filters.city = req.query.city;

    const requests = await BloodRequest.find(filters).populate('requestedBy', 'name email');
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single request by ID
exports.getRequestById = async (req, res) => {
  try {
    const request = await BloodRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });
    res.json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update request (PUT)
exports.updateBloodRequest = async (req, res) => {
  try {
    const updated = await BloodRequest.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Request not found" });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Patch request
exports.patchBloodRequest = async (req, res) => {
  try {
    const updated = await BloodRequest.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Request not found" });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete request
exports.deleteBloodRequest = async (req, res) => {
  try {
    const removed = await BloodRequest.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ message: "Request not found" });
    res.json({ message: "Blood request deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Approve or reject request
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body; // approved / rejected

    const updated = await BloodRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Request not found" });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
