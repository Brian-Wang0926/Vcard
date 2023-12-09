// 若checkEligibility完成後 eligibleForCard = true 的數量為奇數，
// 代表會有一個人無法配對，就會去 eligibleForCard = false 的使用者中，
// 找到 lastActiveDate 最近的一名使用者，將他的eligibleForCard 改為 true

const User = require("../models/user-model");
const Card = require("../models/card-model");

const checkEligibility = async (req, res) => {
  try {
    const users = await User.find({}, "lastActiveDate eligibleForCard");
    const currentDate = new Date();

    let eligibleCount = 0;

    const bulkUpdateOperations = users.map((user) => {
      const diffTime = Math.abs(currentDate - user.lastActiveDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays > 3) {
        user.eligibleForCard = false;
      } else {
        user.eligibleForCard = true;
        eligibleCount++;
      }
      console.log("已完成抽卡資格名單");

      return {
        updateOne: {
          filter: { _id: user._id },
          update: {
            $set: {
              eligibleForCard: user.eligibleForCard,
            },
          },
        },
      };
    });

    await User.bulkWrite(bulkUpdateOperations);

    // 如果有資格抽卡的人數是奇數，找出一個未獲得資格但最近活躍得用戶，给予抽卡資格
    if (eligibleCount % 2 !== 0) {
      console.log("抽卡資格人數為奇數");
      const lastActiveIneligibleUser = await User.findOne({
        eligibleForCard: false,
      }).sort({ lastActiveDate: -1 });

      if (lastActiveIneligibleUser) {
        lastActiveIneligibleUser.eligibleForCard = true;
        await lastActiveIneligibleUser.save();
        eligibleCount++;
      }
    }

    console.log("已確認可參加抽卡名單");
  } catch (e) {
    console.error("Error during checking:", e);
  }
};

const pairUsers = async (req, res) => {
  try {
    console.log("開始配對");
    // 先列出所有符合抽卡資格的人
    const eligibleUsers = await User.find(
      { eligibleForCard: true },
      "_id cardsDrawn"
    );
    console.log("有資格配對名單", eligibleUsers);
    const newCards = []; //保存新建的卡片，每一張卡片代表一組配對
    const updateUserPromises = []; //保存所有更新用戶資訊的異步操作
    const pairedUsersSet = new Set(); //一個集合(set)，用來追蹤已經配對的用戶

    for (let i = 0; i < eligibleUsers.length; i++) {
      let userA = eligibleUsers[i];
      // If userA has already been paired, skip
      if (pairedUsersSet.has(userA._id.toString())) continue;

      for (let j = i + 1; j < eligibleUsers.length; j++) {
        let userB = eligibleUsers[j];
        // If userB has already been paired or has drawn userA or userA has drawn userB, skip
        if (
          pairedUsersSet.has(userB._id.toString()) ||
          userA.cardsDrawn.includes(userB._id) ||
          userB.cardsDrawn.includes(userA._id)
        ) {
          continue;
        }

        newCards.push({
          userID1: userA._id,
          userID2: userB._id,
        });

        // 设置配对的失效时间
        newCards.forEach((card) => {
          card.expiryDate = new Date(Date.now() + 24 * 60 * 60 * 1000); // 设置为当前时间加24小时
        });

        userA.cardsDrawn.push(userB._id);
        userB.cardsDrawn.push(userA._id);

        // Update user data
        updateUserPromises.push(
          User.findByIdAndUpdate(userA._id, {
            eligibleForCard: false,
            cardsDrawn: userA.cardsDrawn,
          })
        );
        updateUserPromises.push(
          User.findByIdAndUpdate(userB._id, {
            eligibleForCard: false,
            cardsDrawn: userB.cardsDrawn,
          })
        );

        // Add both userA and userB to pairedUsersSet
        pairedUsersSet.add(userA._id.toString());
        pairedUsersSet.add(userB._id.toString());

        break; // Break the inner loop once userA has been paired
      }
    }
    // Batch insert and batch update
    await Card.insertMany(newCards);
    await Promise.all(updateUserPromises);
    console.log("已完成配對", newCards);
  } catch (e) {
    console.error("Error during pairing:", e);
    res.status(500).json({ message: "Internal server error." });
  }
};

const getPairs = async (req, res) => {
  try {
    const userId = req.userId;
    const currentDate = new Date();
    console.log("getPairs", userId);
    const cards = await Card.find({
      $or: [{ userID1: userId }, { userID2: userId }],
      expiryDate: { $gte: currentDate },
    }).populate("userID1 userID2");
    res.json(cards);
  } catch (e) {
    console.error("Error getting pairs:", e);
    res.status(500).json({ message: "Internal server error." });
  }
};

const agreePairs = async (req, res) => {
  const cardId = req.body.cardId;
  const userId = req.userId;

  const card = await Card.findById(cardId);
  if (card) {
    if (!card.acceptedBy.includes(userId)) {
      card.acceptedBy.push(userId);
    }
    // 當兩位使用者都接受配對時
    if (card.acceptedBy.length === 2 && !card.status) {
      card.status = true;

      // 將兩名用戶新增至彼此的好友列表
      const user1 = await User.findById(card.userID1);
      const user2 = await User.findById(card.userID2);

      if (!user1.friends.includes(user2._id)) {
        user1.friends.push(user2._id);
        await user1.save();
      }

      if (!user2.friends.includes(user1._id)) {
        user2.friends.push(user1._id);
        await user2.save();
      }
    }
    await card.save();

    res.status(200).send({ message: "Card updated successfully." });
  } else {
    res.status(404).send({ message: "Card not found." });
  }
};

const clearExpiredPairs = async () => {
  try {
    const currentDate = new Date();
    // 标记过期的配对为无效
    await Card.updateMany(
      { expiryDate: { $lt: currentDate } },
      { $set: { status: false } }
    );
    console.log("已标记过期配对");
  } catch (e) {
    console.error("Error during marking expired pairs:", e);
  }
};

module.exports = {
  checkEligibility,
  pairUsers,
  getPairs,
  agreePairs,
  clearExpiredPairs,
};
