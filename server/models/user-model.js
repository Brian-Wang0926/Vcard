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
  },
  date: {
    type: Date,
    default: Date.now,
  },
  lastActiveDate: {
    type: Date,
    default: Date.now,
  },
  // 是否有資格抽卡
  eligibleForCard: {
    type: Boolean,
    default: true,
  },
  // 以抽卡id列表
  cardsDrawn: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
