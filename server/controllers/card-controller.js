const User = require("../models/User");
const Card = require("../models/Card");

const checkEligibility = async (req, res) => {
  const user = await User.findById(req.params.userId);
  console.log(user);

  const currentDate = new Date();
  const diffTime = Math.abs(currentDate - user.lastActiveDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays > 3) {
    user.eligibleForCard = false;
  } else {
    user.eligibleForCard = true;
  }

  await user.save();
  res.json({ eligibleForCard: user.eligibleForCard });
};

const pairUsers = async (req, res) => {
  // 先列出所有符合抽卡資格的人
  const eligibleUsers = await User.find({ eligibleForCard: true });
  for (let i = 0; i < eligibleUsers.length; i++) {
    for (let j = i + 1; j < eligibleUsers.length; j++) {
      if (
        !eligibleUsers[i].cardsDrawn.includes(eligibleUsers[j]._id) &&
        !eligibleUsers[j].cardsDrawn.includes(eligibleUsers[i]._id)
      ) {
        const card = new Card({
          userID1: eligibleUsers[i]._id,
          userID2: eligibleUsers[j]._id,
          date: new Date(),
        });
        await card.save();

        eligibleUsers[i].cardsDrawn.push(eligibleUsers[j]._id);
        eligibleUsers[j].cardsDrawn.push(eligibleUsers[i]._id);
        await eligibleUsers[i].save();
        await eligibleUsers[j].save();
        break;
      }
    }
  }

  res.json({ message: "Pairing completed." });
};

module.exports = {
  checkEligibility,
  pairUsers,
};
