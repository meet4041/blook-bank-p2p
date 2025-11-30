const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || "testsecret";

exports.signForTest = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      email: user.email
    },
    JWT_SECRET,
    { expiresIn: "1h" }
  );
};
