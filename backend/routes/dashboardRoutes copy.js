const express = require("express");
const router = express.Router();

const { auth, adminOnly } = require("../middleware/authMiddleware");
const { getUserDashboard, getDashboardCounts } = require("../controllers/dashboardController");

router.get("/user", auth, getUserDashboard);
router.get("/counts", auth, adminOnly, getDashboardCounts);

module.exports = router;