const mongoose = require("mongoose");
const Article = require("../models/article-model");
const Board = require("../models/board-model");

mongoose
  .connect("mongodb://localhost:27017/Vcard", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("已連接到MongoDB數據庫");
  })
  .catch((e) => {
    console.error("連接到MongoDB數據庫錯誤", e);
  });

const createTestArticlesForBoards = async () => {
  try {
    // Assuming you want to create articles for all boards in the database
    const boards = await Board.find();

    for (const board of boards) {
      // Now let's create 3 test articles for each board
      for (let i = 1; i <= 3; i++) {
        const newArticle = new Article({
          title: `Test Article ${i} for ${board.name}`,
          content:
            "This is a test content. On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed and every pain avoided. But in certain circumstances and owing to the claims of duty or the obligations of business it will frequently occur that pleasures have to be repudiated and annoyances accepted. The wise man therefore always holds in these matters to this principle of selection: he rejects pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains.On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed and every pain avoided. But in certain circumstances and owing to the claims of duty or the obligations of business it will frequently occur that pleasures have to be repudiated and annoyances accepted. The wise man therefore always holds in these matters to this principle of selection: he rejects pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains.On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed and every pain avoided. But in certain circumstances and owing to the claims of duty or the obligations of business it will frequently occur that pleasures have to be repudiated and annoyances accepted. The wise man therefore always holds in these matters to this principle of selection: he rejects pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains",
          author: "65449fc4918cea6aadf4aca1",
          board: board._id,
          mediaUrls: [
            "https://picsum.photos/300/400",
            "https://picsum.photos/300/400",
            "https://picsum.photos/300/400",
            "https://picsum.photos/300/400",
          ],
        });

        await newArticle.save();
        console.log(`文章 '${newArticle.title}' 已創建於看板 '${board.name}'`);
      }
    }
  } catch (e) {
    console.error("創建測試文章出錯", e);
  } finally {
    // Disconnect from the database
    await mongoose.disconnect();
    console.log("數據庫連接已關閉");
  }
};

createTestArticlesForBoards();
