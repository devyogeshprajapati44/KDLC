const express = require("express");
const router = express.Router();

const { auth, authorize } = require("../middleware/authMiddleware");

const {
    getUserDashboard,
    getDashboardCounts,
} = require("../controllers/dashboardController");

// User Dashboard
router.get("/user", auth, getUserDashboard);

// Admin Dashboard Counts
router.get(
    "/counts",
    auth,
    authorize("SUPER_ADMIN", "ADMIN"),
    getDashboardCounts
);

module.exports = router;