require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");


app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));

mongoose.connect(process.env.MONGO_URI, {
  dbName: "authDB"
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

app.use(express.json({ limit: "50mb" }));

app.use(express.urlencoded({
  extended: true,
  limit: "50mb"
}));

const authRoutes = require("./routes/authRoutes");
app.use("/api/v1/auth", authRoutes);

const userRoutes = require("./routes/userRoutes");
app.use("/api/v1/user", require("./routes/userRoutes"));
app.use("/api/v1/uploads", express.static("uploads"));

const productRoutes = require("./routes/productRoutes");
app.use("/api/v1/products", productRoutes);

const categoryRoutes = require("./routes/categoryRoutes");
app.use("/api/v1/category", categoryRoutes);

app.use("/uploads", express.static("uploads"));

const orderRoutes = require("./routes/orderRoutes");

app.use("/api/v1/orders", orderRoutes);

app.use("/api/v1/dashboard", require("./routes/dashboardRoutes"));

app.get("/", (req, res) => {
  res.send("Server running...");
});

const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});