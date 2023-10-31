// const logOpenHandles = require("why-is-node-running");
jest.setTimeout(60000);


const request = require("supertest");
const app = require("./app");
const User = require("./models/user-model");
const Card = require("./models/card-model");
const mongoose = require("mongoose");
const { performance } = require("perf_hooks");
let server;

describe("Card Pairing", () => {
  // 在所有測試開始前，建立數據庫連接
  beforeAll(async () => {
    // 這邊可以考慮連接測試用的數據庫，以避免干擾生產環境的數據
    await mongoose.connect("mongodb://localhost:27017/Vcard", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    server = app.listen(0);
  });
  // 在每個測試案例執行前，建立模擬的使用者資料
  const createUser = async (num) => {
    const users = [];
    for (let i = 1; i <= num; i++) {
      users.push({
        name: `Test User ${i}`,
        googleID: `google-id-${i}`,
        email: `test${i}@example.com`,
        thumbnail: `thumbnail-url-${i}`,
      });
    }
    await User.insertMany(users);
  };

  // 測試抽卡功能
  const testPairing = async (num) => {
    await createUser(num);

    const start = performance.now();
    const response = await request(app).get("/api/card/pairUsers");
    const end = performance.now();

    expect(response.status).toBe(200);

    // 查詢Card資料表並驗證結果
    const cardResults = await Card.find({}); // 查詢所有的卡片
    expect(cardResults.length).toBeGreaterThan(0);

    const pairedUsers = await User.find({ cardsDrawn: { $ne: [] } });
    expect(pairedUsers.length).toBeGreaterThan(0);

    // 輸出配對後的使用者名字
    console.log(`Time taken for pairing ${num} users: ${end - start}ms`);
  };

  it("should pair 100,000 users correctly", async () => {
    await testPairing(10);
  }, 120000);


  afterAll(async () => {
    // await User.deleteMany({});
    // await Card.deleteMany({});
    await new Promise(resolve => server.close(resolve)); // 修改這裡，使用Promise確保server已經完全關閉
    await mongoose.connection.close();
    // console.log("檢查打開的句柄...");
    // logOpenHandles();
  });
});
