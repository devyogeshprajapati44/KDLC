const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// ================= CREATE CUSTOMER =================
const createCustomer = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      password,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required.",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      role: "CUSTOMER",
    });

    const userData = user.toObject();

    delete userData.password;
    delete userData.__v;

    return res.status(201).json({
      success: true,
      message: "Customer created successfully.",
      data: userData,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= REGISTER =================

const register = async (req, res) => {
  try {
    const { name, email, phone, address, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required.",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let userRole = "CUSTOMER";
   
    if (role) {
      const roles = [
        "SUPER_ADMIN",
        "ADMIN",
        "MANAGER",
        "CUSTOMER",
      ];

      if (!roles.includes(role)) {
        return res.status(400).json({
          success: false,
          message: "Invalid role.",
        });
      }

      userRole = role;
    }

    const user = await User.create({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      role: userRole,
    });

    const userData = user.toObject();

    delete userData.password;
    delete userData.__v;

    res.status(201).json({
      success: true,
      message: "User registered successfully.",
      user: userData,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


// ================= LOGIN =================
const login = async (req, res) => {

  try {

    const { email, password } = req.body;

    if (!email || !password) {

      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });

    }

    const user = await User.findOne({ email });

    if (!user) {

      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });

    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {

      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });

    }

    // Access Token
    const accessToken = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "30m",
      }
    );

    // Refresh Token
    const refreshToken = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: "7d",
      }
    );


    res.status(200).json({
      success: true,
      message: "Login successful.",
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

// ================= PROFILE =================
const getProfile = async (req, res) => {

  try {

    const user = await User.findById(req.user.id).select("-password -__v");

    if (!user) {

      return res.status(404).json({
        success: false,
        message: "User not found.",
      });

    }

    res.status(200).json({
      success: true,
      data: user,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

// ================= USER LIST =================
const getUserList = async (req, res) => {

  try {

    const users = await User.find().select("-password -__v");

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

// ================= DELETE USER =================
const deleteUser = async (req, res) => {

  try {

    const user = await User.findById(req.params.id);

    if (!user) {

      return res.status(404).json({
        success: false,
        message: "User not found.",
      });

    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: "User deleted successfully.",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

// ================= REFRESH TOKEN =================
const refreshToken = async (req, res) => {

  try {

    const { refreshToken } = req.body;

    if (!refreshToken) {

      return res.status(401).json({
        success: false,
        message: "Refresh token is required.",
      });

    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );

    const user = await User.findById(decoded.id);

    if (!user) {

      return res.status(404).json({
        success: false,
        message: "User not found.",
      });

    }

    const accessToken = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "15m",
      }
    );

    res.status(200).json({
      success: true,
      accessToken,
    });

  } catch (error) {

    res.status(401).json({
      success: false,
      message: "Invalid or expired refresh token.",
    });

  }

};

// ================= EXPORT =================
module.exports = {
  register,
  login,
  getProfile,
  getUserList,
  deleteUser,
  refreshToken,
  createCustomer,
};