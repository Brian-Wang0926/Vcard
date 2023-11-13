const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
// const multer = require("multer");
// const upload = multer({ storage: multer.memoryStorage() });
// const mysql = require("mysql");
const mongoose = require("mongoose");

const passport = require("passport");
require("./config/passport")(passport);

const authRoute = require("./routes/auth-route");
const cardRoute = require("./routes/card-route");
const chatRoute = require("./routes/chat-route");
const profileRoute = require("./routes/profile-route");
const articleRoute = require("./routes/article-route");

mongoose
  .connect("mongodb://localhost:27017/Vcard")
  .then(() => {
    console.log("連結到mongodb...");
  })
  .catch((e) => {
    console.log(e);
  });

// 建立資料庫 rds 連結
// const db = mysql.createConnection({
//   host: process.env.YOUR_RDS_ENDPOINT,
//   user: process.env.YOUR_DB_USERNAME,
//   password: process.env.YOUR_DB_PASSWORD,
//   database: process.env.YOUR_DB_NAME,
// });

// 連接資料庫 rds
// db.connect((err) => {
//   if (err) {
//     console.error("Error connecting to the database:", err.stack);
//     return;
//   }
//   console.log("Connected to the database.");
// });

// 引入v3的客戶端和命令
// const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

// const s3Client = new S3Client({
//   region: process.env.YOUR_AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.YOUR_AWS_ACCESS_KEY,
//     secretAccessKey: process.env.YOUR_AWS_SECRET_KEY,
//   },
// });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(passport.initialize());

app.use("/api/auth", authRoute);
app.use("/api/card", cardRoute);
app.use("/api/chat", chatRoute);
app.use("/api/profile", profileRoute);
app.use("/api/article", articleRoute);

// 週作業，暫時放這
// app.get("/api/getAllPosts", (req, res) => {
//   db.query("SELECT * FROM text_table ORDER BY id DESC", (err, results) => {
//     if (err) {
//       console.log("無法從資料庫取得資料", err.stack);
//       return res.status(500).send("無法從資料庫取得資料");
//     }
//     res.json(results);
//   });
// });

// app.post("/api/post", upload.single("image"), async (req, res) => {
//   const { text } = req.body;
//   const file = req.file;
//   console.log("Received text:", text);

//   // 將圖片檔案上傳s3
//   if (file) {
//     const params = {
//       Bucket: process.env.YOUR_S3_BUCKET_NAME,
//       Key: file.originalname, // 文件名
//       Body: file.buffer,
//     };

//     try {
//       await s3Client.send(new PutObjectCommand(params));
//       const imageURL = `${process.env.CLOUDFRONT_URL}/${file.originalname}`;

//       // 將文字上傳資料庫
//       db.query(
//         "INSERT INTO text_table (text, image_url) VALUES (?, ?)",
//         [text, imageURL],
//         (err) => {
//           if (err) {
//             console.error("無法新增至資料庫:", err.stack);
//             return res.status(500).send("無法新增至資料庫");
//           }
//           console.log("Text 及 images 已成功新增至資料庫.");
//         }
//       );
//     } catch (e) {
//       console.log("Error uploading file:", e);
//       return res.status(500).send("Error uploading file");
//     }
//   } else {
//     console.log("No file received.");
//   }

//   return res.send("Post successfully saved");
// });

// 這樣測試文件可以導入app
module.exports = app;
