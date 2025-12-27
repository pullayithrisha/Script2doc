require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./controllers/authController");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

app.post("/api/auth/signup", authRoutes.signup);
app.post("/api/auth/login", authRoutes.login);

app.listen(process.env.PORT, () =>
  console.log("Auth server running on port", process.env.PORT)
);
