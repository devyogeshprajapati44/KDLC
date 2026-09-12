const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    quantity: {
      type: Number,
      default: 1,
    },

    price: {
      type: Number,
      default: 0,
    },

    currency: {
      code: {
        type: String,
        default: "USD"
      },
      symbol: {
        type: String,
        default: "$"
      }
    },

    discount: {
      type: Number,
      default: 0,
    },

    total_price: {
      type: Number,
      default: 0,
    },

    shippingAddress:{
      name:String,
      phone:String,
      city:String,
      state:String,
      pincode:String,
      address:String
    },

    status: {
      type: String,
      enum: [
        "booked",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ],
      default: "booked",
    },

    payment_status: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending"
    },

    payment_method: {
      type: String,
      default: ""
    },

    transactionId: {
      type: String,
      default: ""
    },

  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
