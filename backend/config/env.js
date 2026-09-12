const dotenv = require("dotenv");

// Load .env file
dotenv.config();

// Required Environment Variables
const requiredEnv = [
  "MONGO_URI",
  "JWT_SECRET",
  "JWT_REFRESH_SECRET",
];

requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    console.error(`❌ Missing environment variable: ${key}`);
    process.exit(1);
  }
});

module.exports = {
  // App
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",
  APP_NAME: process.env.APP_NAME || "KDLC API",

  // Database
  MONGO_URI: process.env.MONGO_URI,

  // JWT
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "15m",
  JWT_REFRESH_EXPIRES_IN:
    process.env.JWT_REFRESH_EXPIRES_IN || "7d",

  // Client
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",

  // Upload
  MAX_FILE_SIZE: Number(process.env.MAX_FILE_SIZE || 5242880),

  // Mail (Optional)
  MAIL_HOST: process.env.MAIL_HOST || "",
  MAIL_PORT: process.env.MAIL_PORT || "",
  MAIL_USER: process.env.MAIL_USER || "",
  MAIL_PASS: process.env.MAIL_PASS || "",
};