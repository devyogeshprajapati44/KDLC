const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

// =====================================================
// CREATE CUSTOMER
// SUPER_ADMIN + ADMIN
// =====================================================

const createCustomer = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      password,
    } = req.body;

    // ================= VALIDATION =================

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required.",
      });
    }

    // ================= CHECK EMAIL =================

    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists.",
      });
    }

    // ================= HASH PASSWORD =================

    const hashedPassword = await bcrypt.hash(password, 10);

    // ================= CREATE CUSTOMER =================

    const customer = await User.create({
      name,
      email: email.toLowerCase(),
      phone: phone || "",
      address: address || "",
      password: hashedPassword,

      // IMPORTANT:
      // Role frontend/Postman se nahi liya jayega
      role: "CUSTOMER",

      isActive: true,
    });

    // ================= REMOVE SENSITIVE DATA =================

    const customerData = customer.toObject();

    delete customerData.password;
    delete customerData.__v;

    // ================= RESPONSE =================

    return res.status(201).json({
      success: true,
      message: "Customer created successfully.",
      data: customerData,
    });

  } catch (error) {
    console.error("CREATE CUSTOMER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create customer.",
      error: error.message,
    });
  }
};


// =====================================================
// EXPORT
// =====================================================

module.exports = {
  createCustomer,
};