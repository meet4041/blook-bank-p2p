/**
 * Allow selected roles
 * Example: router.post("/verify", auth, allowRoles("hospital"), controller.verifyDonor)
 */
exports.allowRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: "Access denied. Insufficient permissions."
      });
    }
    next();
  };
};

/**
 * Owner only OR Admin override
 * Example:
 * router.put("/:id", auth, ownerOrAdmin("Donor"), updateDonor)
 */
exports.ownerOrAdmin = (Model, field = "addedBy") => {
  return async (req, res, next) => {
    try {
      const resource = await Model.findById(req.params.id);

      if (!resource) {
        return res.status(404).json({ success: false, error: "Resource not found" });
      }

      // Admin can modify any resource
      if (req.user.role === "admin") {
        req.resource = resource;
        return next();
      }

      // Check if the logged-in user is the owner
      if (resource[field].toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          error: "Access denied. Not the owner of this resource."
        });
      }

      req.resource = resource;
      next();
    } catch (err) {
      res.status(500).json({
        success: false,
        error: "Server error (owner check failed)",
        details: err.message
      });
    }
  };
};
