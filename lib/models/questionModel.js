// lib/models/questionModel.js

import mongoose from "mongoose";

const { Schema } = mongoose;

const questionSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    votes: {
      type: Number,
      default: 0,
    },
    answers: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    tags: [
      {
        type: String,
      },
    ],
    author: {
      type: String, // or Schema.Types.ObjectId if referencing a User model
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true, // This adds `createdAt` and `updatedAt` fields
  }
);

const Question = mongoose.models.Question || mongoose.model("Question", questionSchema);

export default Question;