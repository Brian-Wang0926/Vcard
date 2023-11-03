const mongoose = require("mongoose");
const { Schema } = mongoose;

const cardSchema = new Schema({
  userID1: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  userID2: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  status: {   //是否配對成功( true 成功、false 失敗)
    type: Boolean,
    default: false,
  },
  acceptedBy: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

module.exports = mongoose.model("Card", cardSchema);
