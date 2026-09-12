const User = require("../models/userModel");
const Product = require("../models/productModel");
const Order = require("../models/Order");

// ✅ Admin Dashboard
const getDashboardCounts = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    res.json({
      success: true,
      data: {
        totalUsers,
        totalProducts,
        totalOrders,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ User Dashboard
const getUserDashboard = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id || req.user.userId;

    const totalOrders = await Order.countDocuments({
      user_id: userId,
    });

    const recentOrders = await Order.find({ user_id: userId })
      .populate("product_id")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      data: { totalOrders, recentOrders },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getDashboardCounts, getUserDashboard };