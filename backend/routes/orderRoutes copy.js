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
  updateOrderStatus
} = require("../controllers/orderController");

const { auth , adminOnly } = require("../middleware/authMiddleware");
router.post("/book", auth, bookProduct);
router.post("/checkout", auth, checkoutOrder);
router.get("/invoice/:id", auth, getInvoice);
router.delete("/invoice/:id", auth, deleteInvoice);
router.get("/my-orders", auth, getMyOrders);
router.get("/all-orders", auth, adminOnly, getAllOrders);
router.get("/:id", auth, getSingleOrder);
router.patch("/:id/status", auth, adminOnly, updateOrderStatus);
module.exports = router;