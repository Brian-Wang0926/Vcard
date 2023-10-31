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
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "accepted", "rejected"],  // 卡片的狀態可以是"待定"、"已接受"或"已拒絕"
    },
  });
  
  module.exports = mongoose.model("Card", cardSchema);
  

