const jwt = require("jsonwebtoken");

const ensureAuthentication = (req, res, next) => {
  const auth = req.headers["authorization"];

  if (!auth) {
    return res
      .status(403)
      .json({ message: "Unauthorized,JWT token is required" });
  }

  try {
    const decoded = jwt.verify(auth, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res
      .status(403)
      .json({ message: "unauthorized,JWT token wrong or expire" });
  }
};

module.exports = ensureAuthentication;
