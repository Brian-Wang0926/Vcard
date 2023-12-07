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
const esClient = require("./elasticsearch-client");

const mongoose = require("mongoose");
const mongooseUri = process.env.MONGODB_URI;

mongoose
  .connect(mongooseUri, { useNewUrlParser: true, useUnifiedTopology: true })
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

// 搜索框
app.get("/api/search", async (req, res) => {
  const { searchTerm } = req.query;
  try {
    console.log("後端searchTerm", searchTerm);
    const result = await esClient.search({
      index: "your-article-index", // 替換為您的索引名
      body: {
        query: {
          match: {
            title: searchTerm, // 或其他適當的字段
          },
        },
      },
    });
    res.json(result.body.hits.hits);
  } catch (error) {
    console.error("Search API error:", error);
    res.status(500).json({ message: "Search error", error });
  }
});

module.exports = app;
