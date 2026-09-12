const express = require("express");

const router = express.Router();

const {
  createCustomer,
  getUserList,
  deleteUser,
} = require("../controllers/authController");

const {
  auth,
  authorize,
} = require("../middleware/authMiddleware");


// =====================================================
// CREATE CUSTOMER
// SUPER_ADMIN + ADMIN
// =====================================================

router.post(
  "/create-customer",
  auth,
  authorize("SUPER_ADMIN", "ADMIN"),
  createCustomer
);


// =====================================================
// GET USER LIST
// SUPER_ADMIN + ADMIN
// =====================================================

router.get(
  "/userlist",
  auth,
  authorize("SUPER_ADMIN", "ADMIN"),
  getUserList
);


// =====================================================
// DELETE USER
// SUPER_ADMIN + ADMIN
// =====================================================

router.delete(
  "/user/:id",
  auth,
  authorize("SUPER_ADMIN", "ADMIN"),
  deleteUser
);


module.exports = router;