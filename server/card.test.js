// const logOpenHandles = require("why-is-node-running");
jest.setTimeout(60000);

const request = require("supertest");
const http = require("http");
const app = require("./app");
const User = require("./models/user-model");
const Card = require("./models/card-model");
const mongoose = require("mongoose");
const mongooseUri =
  process.env.MONGODB_URI || "mongodb://localhost:27017/Vcard";
const { performance } = require("perf_hooks");
let server;
const cardController = require("./controllers/card-controller");

describe("Card Pairing", () => {
  // 在所有測試開始前，建立數據庫連接
  beforeAll(async () => {
    await mongoose.connect(mongooseUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    server = http.createServer(app).listen(0);
    console.log("成功連結", server);
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await Card.deleteMany({});
    console.log("成功刪除");
  });
  

  // 在每個測試案例執行前，建立模擬的使用者資料
  const createUser = async (num) => {
    const users = [];
    for (let i = 1; i <= num; i++) {
      users.push({
        name: `Test User ${i}`,
        googleID: `google-id-${i}`,
        email: `test${i}@example.com`,
      });
    }
    console.log("創建使用者", users);
    await User.insertMany(users);
  };

  // 測試抽卡功能
  const testPairing = async (num) => {
    await createUser(num);

    const start = performance.now();
    await cardController.pairUsers();
    const end = performance.now();
    console.log("配對結果完成");

    // 查詢Card資料表並驗證結果
    const cardResults = await Card.find({}); // 查詢所有的卡片
    expect(cardResults.length).toBeGreaterThan(0);

    const pairedUsers = await User.find({ cardsDrawn: { $ne: [] } });
    expect(pairedUsers.length).toBeGreaterThan(0);

    // 輸出配對後的使用者名字
    console.log(`Time taken for pairing ${num} users: ${end - start}ms`);
  };

  // it("should pair 10 users correctly", async () => {
  //   await testPairing(10);
  // }, 120000);

  it("should set correct expiryDate and status on pairs", async () => {
    await testPairing(10);
    console.log("配對結束");
    const cards = await Card.find({});
    console.log("過期", cards);
    cards.forEach((card) => {
      expect(card.status).toBe(true);
      expect(new Date(card.expiryDate).getTime()).toBeGreaterThan(Date.now());
    });
  }, 120000);

  it("pairs should disappear after a day", async () => {
    await testPairing(10);

    // 模拟时间流逝
    jest
      .spyOn(global, "Date")
      .mockImplementation(() => new Date("2023-01-02T00:00:00Z"));

    const response = await request(server).get("/api/card/getPairs");
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(0);

    // 还原时间模拟
    global.Date.mockRestore();
  }, 120000);

  afterAll(async () => {
    // await User.deleteMany({});
    // await Card.deleteMany({});
    await new Promise((resolve) => server.close(resolve)); // 修改這裡，使用Promise確保server已經完全關閉
    await mongoose.connection.close();
  });
});
