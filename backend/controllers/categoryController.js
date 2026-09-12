const Category = require("../models/Category");

// Create Category
exports.addCategory = async (req, res) => {
  try {
    const { name, parentId, type } = req.body;

    const category = await Category.create({
      name,
      parentId:
        !parentId || parentId === "null" || parentId === "undefined"
          ? null
          : parentId,
      type: type || "product",
      categoryImage: req.file ? req.file.filename : "",
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Build Category Tree
const buildTree = (categories, parent = null) => {
  return categories
    .filter((cat) =>
      parent
        ? cat.parentId?.toString() === parent.toString()
        : cat.parentId === null
    )
    .map((cat) => ({
      ...cat._doc,
      children: buildTree(categories, cat._id),
    }));
};

// Get All Categories
exports.getAllCategory = async (req, res) => {
  try {
    const categories = await Category.find();

    const tree = buildTree(categories);

    res.json({
      success: true,
      data: tree,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Update Category
exports.updateCategories = async (req, res) => {
  try {
    const { _id, name, parentId, type } = req.body;

    await Category.findByIdAndUpdate(_id, {
    name,
    parentId:
        !parentId || parentId === "null" || parentId === "undefined"
        ? null
        : parentId,
    type,
    });

    res.json({
      success: true,
      message: "Category updated",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Delete Category
exports.deleteCategories = async (req, res) => {
  try {
    const ids = req.body.map((item) => item._id);

    await Category.deleteMany({
      _id: { $in: ids },
    });

    res.json({
      success: true,
      message: "Categories deleted",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};