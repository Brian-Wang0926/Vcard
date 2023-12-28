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
app.use(cors(corsOptions));
// const amqp = require('amqplib');

const passport = require("passport");
require("./config/passport")(passport);

const authRoute = require("./routes/auth-route");
const cardRoute = require("./routes/card-route");
const chatRoute = require("./routes/chat-route");
const profileRoute = require("./routes/profile-route");
const articleRoute = require("./routes/article-route");
const commentRoute = require("./routes/comment-route");

const mongoose = require("mongoose");
const mongooseUri = process.env.MONGODB_URI;

mongoose
  .connect(mongooseUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("連結到mongodb...");
  })
  .catch((e) => {
    console.log("mongoose連接失敗", e);
  });

// const {
//   client,
//   setupElasticsearch,
//   handleArticleChange,
// } = require("./elasticsearchService");

// setupElasticsearch();

// const Article = require("./models/article-model");

// // MongoDB 變更流監聽
// const articleChangeStream = Article.watch();
// articleChangeStream.on("change", handleArticleChange);

// // 搜索框
// app.get("/api/search", async (req, res) => {
//   const { searchTerm } = req.query;
//   try {
//     console.log("後端searchTerm", searchTerm);
//     // 直接使用 Elasticsearch 客户端进行搜索
//     const result = await client.search({
//       index: "articles",
//       body: {
//         query: {
//           multi_match: {
//             query: searchTerm,
//             fields: ["title", "content"],
//           },
//         },
//       },
//     });
//     console.log("searchTerm回傳result", result);
//     res.json(result.body.hits.hits);
//   } catch (error) {
//     console.error("Search API error:", error);
//     res.status(500).json({ message: "Search error", error });
//   }
// });

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
