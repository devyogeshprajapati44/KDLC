const express = require("express");
const router = express.Router();

const {
    createProduct,
    updateProduct,
    getProductById,
    getProducts,
    deleteProduct,
} = require("../controllers/productController");

const { auth, authorize } = require("../middleware/authMiddleware");

const upload = require("../middleware/upload");

// Public Routes
router.get("/", getProducts);
router.get("/:id", getProductById);

// Protected Routes
router.post(
    "/", auth, authorize("SUPER_ADMIN", "ADMIN", "MANAGER"), upload.array("images", 5), createProduct
);

router.put("/:id", auth, authorize("SUPER_ADMIN", "ADMIN", "MANAGER"), upload.array("images", 5), updateProduct
);

router.delete( "/:id", auth, authorize("SUPER_ADMIN", "ADMIN"), deleteProduct
);

module.exports = router;