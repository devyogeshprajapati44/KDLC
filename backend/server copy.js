require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");


app.use(cors({
  origin: "http://localhost:3000",
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
app.use("/api/auth", authRoutes);

const userRoutes = require("./routes/userRoutes");
app.use("/api/user", userRoutes);
app.use("/api/uploads", express.static("uploads"));

const productRoutes = require("./routes/productRoutes");
app.use("/api/products", productRoutes);

const categoryRoutes = require("./routes/categoryRoutes");
app.use("/api/category", categoryRoutes);

app.use("/uploads", express.static("uploads"));

const orderRoutes = require("./routes/orderRoutes");

app.use("/api/orders", orderRoutes);

app.use("/api/dashboard", require("./routes/dashboardRoutes"));

app.get("/", (req, res) => {
  res.send("Server running...");
});

const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});