const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    category: {
      type: String,
      required: true,
      enum: ["Mobile", "Laptop", "Tablet", "Accessories", "Furniture","Home Temples"],
    },

      currency: {
      code: {
        type: String,
        default: "INR"
      },
      symbol: {
        type: String,
        default: "₹"
      }
    },


    brand: {
      type: String,
      default: "",
    },

    stock: {
      type: Number,
      required: true,
      default: 0,
    },

    specs: {
      ram: { type: String, default: "" },
      storage: { type: String, default: "" },
      processor: { type: String, default: "" },
      camera: { type: String, default: "" },
      frontCamera: { type: String, default: "" },
      battery: { type: String, default: "" },
      display: { type: String, default: "" },
      modelNo: { type: String, default: "" },
      color: { type: String, default: "" },
    },

    highlights: [String],

    images: [
      {
        type: String,
      },
    ],

    isFeatured: {
      type: Boolean,
      default: false,
    },

    rating: {
      type: Number,
      default: 0,
    },

    numReviews: {
      type: Number,
      default: 0,
    },

    discount: {
      type: Number,
      default: 0,
    },

    finalPrice: {
      type: Number,
    },

    warranty: {
      type: String,
      default: "1 Year Manufacturer Warranty",
    },

    manufacturerInfo: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

productSchema.pre("save", function () {
  if (this.price != null) {
    const discount = this.discount || 0;
    this.finalPrice = this.price - (this.price * discount) / 100;
  }
});

module.exports = mongoose.model("Product", productSchema);