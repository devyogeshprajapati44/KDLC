const express = require("express");
const router = express.Router();

const {
  bookProduct,
  checkoutOrder,
  getMyOrders,
  getAllOrders,
  deleteInvoice,
  getInvoice,
  getSingleOrder,
  updateOrderStatus,
  getOrderTracking
} = require("../controllers/orderController");

const { auth, authorize } = require("../middleware/authMiddleware");

// Customer
router.post("/book", auth, authorize("CUSTOMER"), bookProduct);
router.post("/checkout", auth, authorize("CUSTOMER"), checkoutOrder);
router.get("/invoice/:id", auth, getInvoice);
router.delete("/invoice/:id", auth, deleteInvoice);
router.get("/my-orders", auth, authorize("CUSTOMER"), getMyOrders);
router.get("/:id/track",auth,getOrderTracking);

// Admin
router.get(
  "/all-orders",
  auth,
  authorize("SUPER_ADMIN", "ADMIN"),
  getAllOrders
);

router.get("/:id", auth, getSingleOrder);

router.patch(
  "/:id/status",
  auth,
  authorize("SUPER_ADMIN", "ADMIN", "MANAGER"),
  updateOrderStatus
);

console.log("auth:", typeof auth);
console.log("authorize:", typeof authorize);
console.log(
  "authorize() result:",
  typeof authorize("SUPER_ADMIN", "ADMIN", "MANAGER")
);
console.log("updateOrderStatus:", typeof updateOrderStatus);

module.exports = router;