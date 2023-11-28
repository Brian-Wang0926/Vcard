const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  googleID: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  thumbnail: {
    type: String,
    default: "https://cdn3.iconfinder.com/data/icons/feather-5/24/user-512.png",
  },
  savedArticles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Article",
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
  // 最近登入時間(抽卡用)
  lastActiveDate: {
    type: Date,
    default: Date.now,
  },
  // 是否有資格抽卡
  eligibleForCard: {
    type: Boolean,
    default: true,
  },
  // 已經抽卡id列表
  cardsDrawn: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  friends: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
