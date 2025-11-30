const BloodRequest = require('../models/BloodRequest');

/**************************************
 * CREATE BLOOD REQUEST  
 * Users & Hospitals can create  
 **************************************/
exports.createBloodRequest = async (req, res) => {
  try {
    // CHANGED: Allow both 'user' and 'hospital' roles
    if (!["user", "hospital"].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: "Only users and hospitals can create blood requests"
      });
    }

    // OPTIONAL: Auto-approve requests created by Hospitals
    const initialStatus = req.user.role === 'hospital' ? 'approved' : 'pending';

    const request = new BloodRequest({
      ...req.body,
      requestedBy: req.user.id,
      status: initialStatus
    });

    const saved = await request.save();
    res.status(201).json({ success: true, data: saved });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

/**************************************
 * GET ALL REQUESTS  
 * Public  
 **************************************/
exports.getAllRequests = async (req, res) => {
  try {
    const filters = {};
    if (req.query.bloodGroup) filters.bloodGroup = req.query.bloodGroup;
    if (req.query.city) filters.city = req.query.city;

    const requests = await BloodRequest.find(filters)
      .populate("requestedBy", "name email role");

    res.status(200).json({ success: true, data: requests });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

/**************************************
 * GET REQUEST BY ID  
 **************************************/
exports.getRequestById = async (req, res) => {
  try {
    const request = await BloodRequest.findById(req.params.id)
      .populate("requestedBy", "name email role");

    if (!request) {
      return res.status(404).json({ success: false, error: "Blood request not found" });
    }

    res.status(200).json({ success: true, data: request });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

/**************************************
 * UPDATE BLOOD REQUEST  
 * Users → only own request, cannot change status  
 * Admin / Hospital → can update any request  
 **************************************/
exports.updateBloodRequest = async (req, res) => {
  try {
    const request = await BloodRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, error: "Blood request not found" });
    }

    const isOwner = request.requestedBy.toString() === req.user.id;

    if (req.user.role === "user") {
      if (!isOwner) {
        return res.status(403).json({
          success: false,
          error: "Not authorized to update this request"
        });
      }

      delete req.body.status;
      delete req.body.processedBy;
      delete req.body.processedAt;
    }

    Object.assign(request, req.body);
    const updated = await request.save();

    res.status(200).json({ success: true, data: updated });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

/**************************************
 * PATCH BLOOD REQUEST  
 * Same rules as update  
 **************************************/
exports.patchBloodRequest = async (req, res) => {
  try {
    const request = await BloodRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, error: "Blood request not found" });
    }

    const isOwner = request.requestedBy.toString() === req.user.id;

    if (req.user.role === "user") {
      if (!isOwner) {
        return res.status(403).json({
          success: false,
          error: "Not authorized to update this request"
        });
      }

      delete req.body.status;
      delete req.body.processedBy;
      delete req.body.processedAt;
    }

    Object.assign(request, req.body);
    const updated = await request.save();

    res.status(200).json({ success: true, data: updated });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

/**************************************
 * DELETE BLOOD REQUEST  
 * Users → own  
 * Admin → any  
 **************************************/
exports.deleteBloodRequest = async (req, res) => {
  try {
    const request = await BloodRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, error: "Blood request not found" });
    }

    const isOwner = request.requestedBy.toString() === req.user.id;

    if (req.user.role === "user" && !isOwner) {
      return res.status(403).json({
        success: false,
        error: "Not authorized to delete this request"
      });
    }

    await request.deleteOne();
    return res.status(204).end();

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

/**************************************
 * UPDATE STATUS  
 * Hospital / Admin Only  
 **************************************/
exports.updateStatus = async (req, res) => {
  try {
    if (!["hospital", "admin"].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: "Only hospital/admin can update status"
      });
    }

    const { status } = req.body;
    const allowed = ["pending", "approved"];

    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, error: "Invalid status value" });
    }

    const request = await BloodRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, error: "Blood request not found" });
    }

    request.status = status;
    request.processedBy = req.user.id;
    request.processedAt = new Date();

    const updated = await request.save();

    res.status(200).json({ success: true, data: updated });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};