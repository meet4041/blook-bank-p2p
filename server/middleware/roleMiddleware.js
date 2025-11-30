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

exports.ownerOrAdmin = (Model, field = "addedBy") => {
  return async (req, res, next) => {
    try {
      const resource = await Model.findById(req.params.id);

      if (!resource) {
        return res.status(404).json({ success: false, error: "Resource not found" });
      }

      if (req.user.role === "admin") {
        req.resource = resource;
        return next();
      }

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
