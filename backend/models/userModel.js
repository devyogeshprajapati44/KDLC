const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
{
    name: {
        type: String,
        required: true,
        trim: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },

    phone: {
        type: String,
        default: "",
    },

    address: {
        type: String,
        default: "",
    },

    password: {
        type: String,
        required: true,
    },

    refreshToken: {
    type: String,
    default: null
    },

    role: {
        type: String,
        enum: [
            "SUPER_ADMIN",
            "ADMIN",
            "MANAGER",
            "CUSTOMER",
        ],
        default: "CUSTOMER",
    },

    isActive: {
        type: Boolean,
        default: true,
    },
},
{
    timestamps: true,
});

module.exports = mongoose.model("User", userSchema);