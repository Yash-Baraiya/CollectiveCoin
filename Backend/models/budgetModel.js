const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxLength: 50,
    },
    amount: {
      type: Number,
      required: true,
      maxLength: 20,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      default: "budget",
    },
    description: {
      type: String,
      required: true,
      maxLength: 20,
      trim: true,
    },
    createdBy: {
      type: String,
    },
    familycode: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Budget", budgetSchema);
