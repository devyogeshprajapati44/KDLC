const express = require("express");
const router = express.Router();

const {  register, createCustomer , login, deleteUser, getProfile, getUserList, } = require("../controllers/authController");

const { auth, authorize } = require("../middleware/authMiddleware");

// Register
router.post("/register", register);

// Login
router.post("/login", login);

// Delete User (Only Super Admin & Admin)
router.delete( "/:id", auth, authorize("SUPER_ADMIN", "ADMIN"), deleteUser
);
// Logged-in User Profile
router.get("/profile", auth, getProfile);

router.post("/create-customer", auth, authorize("SUPER_ADMIN", "ADMIN"), createCustomer
);

// User List (Only Super Admin & Admin)
router.get( "/userlist", auth, authorize("SUPER_ADMIN", "ADMIN"), getUserList
);

module.exports = router;