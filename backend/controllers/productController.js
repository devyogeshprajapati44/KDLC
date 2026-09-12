const Product = require("../models/productModel");
const { getCurrencyByCountry } = require("../helpers/utils/currency");

const parseIfString = (value) => {
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch (e) {
      return value; 
    }
  }
  return value;
};

exports.createProduct = async (req, res) => {
  try {
  
    const images = req.files ? req.files.map((file) => file.filename) : [];

    const productData = {
      ...req.body,
      images,
      currency: getCurrencyByCountry(req.body.country)
    };

    if (productData.specs) {
      productData.specs = parseIfString(productData.specs);
    }
    if (productData.highlights) {
      productData.highlights = parseIfString(productData.highlights);
    }
    if (productData.price && productData.discount) {
      const price = Number(productData.price);
      const discount = Number(productData.discount);
      productData.finalPrice = price - (price * discount) / 100;
    }

    if (req.user?.id) {
      productData.user = req.user.id;
    }

    const product = await Product.create(productData);

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    console.log("🔥 CREATE PRODUCT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

// exports.getProducts = async (req, res) => {
//   try {
//     const {
//       keyword,
//       page = 1,
//       limit = 10,
//       minPrice,
//       maxPrice,
//       category,
//       sort,
//     } = req.query;

//     let query = {};

//     if (keyword) {
//       query.name = { $regex: keyword, $options: "i" };
//     }

//     if (minPrice || maxPrice) {
//       query.price = {};
//       if (minPrice) query.price.$gte = Number(minPrice);
//       if (maxPrice) query.price.$lte = Number(maxPrice);
//     }

//     if (category) {
//       query.category = category;
//     }

//     let sortOption = { createdAt: -1 };
//     if (sort) {
//       if (sort === "price") sortOption = { price: 1 };
//       if (sort === "-price") sortOption = { price: -1 };
//     }

//     const products = await Product.find(query)
//       .skip((page - 1) * limit)
//       .limit(Number(limit))
//       .sort(sortOption);

//     const total = await Product.countDocuments(query);

//     res.json({
//       success: true,
//       total,
//       page: Number(page),
//       pages: Math.ceil(total / limit),
//       data: products,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };


exports.getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;

    const skip = (page - 1) * limit;

    const totalProducts = await Product.countDocuments();

    const products = await Product.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: products,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalProducts / limit),
        totalProducts,
        limit
      }
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    let updateData = {
      name: req.body.name ?? product.name,
      price: req.body.price ?? product.price,
      category: req.body.category ?? product.category,
      description: req.body.description ?? product.description,
      brand: req.body.brand ?? product.brand,
      stock: req.body.stock ?? product.stock,
      discount: req.body.discount ?? product.discount,
      isFeatured: req.body.isFeatured ?? product.isFeatured,
      warranty: req.body.warranty ?? product.warranty,
      manufacturerInfo: req.body.manufacturerInfo ?? product.manufacturerInfo,
    };

    if (req.body.specs) {
      const parsedSpecs = parseIfString(req.body.specs);
      updateData.specs = {
        ...product.specs.toObject(),
        ...parsedSpecs,
      };
    }
    if (req.body.highlights) {
      updateData.highlights = parseIfString(req.body.highlights);
    }
    const finalPriceBase = Number(updateData.price);
    const finalDiscount = Number(updateData.discount) || 0;
    updateData.finalPrice =
      finalDiscount > 0
        ? finalPriceBase - (finalPriceBase * finalDiscount) / 100
        : finalPriceBase;

    if (req.files && req.files.length > 0) {
      updateData.images = req.files.map((file) => file.filename);
    } else {
      updateData.images = product.images;
    }

    product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    console.log("🔥 UPDATE PRODUCT ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await product.deleteOne();

    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};