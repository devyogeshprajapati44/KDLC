const express = require("express");
const router = express.Router();

const multer = require("multer");
const path = require("path");

const { addCategory, getAllCategory, updateCategories, deleteCategories,} = require("../controllers/categoryController");

// Image upload configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/category");
  },

  filename: function (req, file, cb) {
    cb(
      null,
      Date.now() + path.extname(file.originalname)
    );
  },
});


const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});


// Routes
router.post( "/add", upload.single("categoryImage"), addCategory  );
router.get("/all", getAllCategory );
router.put( "/update",updateCategories);
router.delete("/delete", deleteCategories);
module.exports = router;