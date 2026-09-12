require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");


app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  dbName: "authDB"
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

app.use(express.json());

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const userRoutes = require("./routes/userRoutes");
app.use("/api/user", userRoutes);

const productRoutes = require("./routes/productRoutes");
app.use("/api/products", productRoutes);

app.use("/uploads", express.static("uploads"));

const orderRoutes = require("./routes/orderRoutes");

app.use("/api/orders", orderRoutes);

app.get("/", (req, res) => {
  res.send("Server running...");
});

const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});