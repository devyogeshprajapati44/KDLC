const env = require("../config/env");

const accessToken = jwt.sign(
  {
    id: user._id,
    role: user.role,
  },
  env.JWT_SECRET,
  {
    expiresIn: env.JWT_EXPIRES_IN,
  }
);