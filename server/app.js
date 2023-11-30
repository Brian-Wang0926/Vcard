const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const corsOptions = {
  origin: process.env.APP_URI, // 允许前端应用的源
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // 如果需要支持凭证
  optionsSuccessStatus: 204,
};

const passport = require("passport");
require("./config/passport")(passport);

const authRoute = require("./routes/auth-route");
const cardRoute = require("./routes/card-route");
const chatRoute = require("./routes/chat-route");
const profileRoute = require("./routes/profile-route");
const articleRoute = require("./routes/article-route");
const commentRoute = require("./routes/comment-route");

const mongoose = require("mongoose");
const mongooseUri =
  process.env.MONGODB_URI || "mongodb://localhost:27017/Vcard";

mongoose
  .connect(mongooseUri)
  .then(() => {
    console.log("連結到mongodb...");
  })
  .catch((e) => {
    console.log(e);
  });

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

app.use("/api/auth", authRoute);
app.use("/api/card", cardRoute);
app.use("/api/chat", chatRoute);
app.use("/api/profile", profileRoute);
app.use("/api/article", articleRoute);
app.use("/api/comment", commentRoute);

module.exports = app;
