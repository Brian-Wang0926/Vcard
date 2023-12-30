require("dotenv").config();
const request = require("supertest");
const app = require("./app"); // 指向您的 Express 應用
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const redisMock = require("redis-mock");
const Article = require("./models/article-model"); // 路徑可能需要調整
const jwt = require("jsonwebtoken");

let mongoServer;
let articleId;
jest.mock("./redis-client", () => redisMock.createClient());
// 測試前的設置
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// 測試後的清理
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Article Controller", () => {
  const testUserId = "658c06506d731ce8c52bcea7";
  const token = jwt.sign({ _id: testUserId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  test("createArticle should save a new article", async () => {
    const articleData = {
      title: "Test Title",
      content: "Test Content",
      author: testUserId,
      board: "658c0672a3fa9b4a498ccd08",
    };

    const response = await request(app)
      .post("/api/article")
      .set("Authorization", `Bearer ${token}`)
      .send(articleData)
      .expect(200);

    expect(response.body.title).toEqual(articleData.title);
    expect(response.body.content).toEqual(articleData.content);
    // 其他斷言
    articleId = response.body._id;
  });

  test("updateArticle should modify an existing article", async () => {
    // 假设 createArticle 已经创建了一个文章，并返回了其 ID
    if (!articleId) {
      throw new Error("Article ID is not set");
    }

    const updatedData = {
      title: "Updated Title",
      content: "Updated Content",
      board: "658c0672a3fa9b4a498ccd08",
    };

    await request(app)
      .put(`/api/article/${articleId}`)
      .set("Authorization", `Bearer ${token}`)
      .send(updatedData)
      .expect(200);
  });

  test("deleteArticle should remove an existing article", async () => {
    // 假设 createArticle 已经创建了一个文章，并返回了其 ID
    if (!articleId) {
      throw new Error("Article ID is not set");
    }

    await request(app)
      .delete(`/api/article/${articleId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    const deletedArticle = await Article.findById(articleId);
    expect(deletedArticle).toBeNull();
  });
  // 其他測試...
});
