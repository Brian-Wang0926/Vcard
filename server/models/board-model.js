const mongoose = require("mongoose");
const { Schema } = mongoose;

const boardSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  englishName: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Board = mongoose.model("Board", boardSchema);

module.exports = Board;
