import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    _id: String,
    quiz: { type: String, ref: "QuizModel" },
    title: String,
    type: { 
      type: String, 
      enum: ["MULTIPLE_CHOICE", "TRUE_FALSE", "FILL_IN_BLANK"],
      default: "MULTIPLE_CHOICE"
    },
    points: { type: Number, default: 1 },
    question: String, // HTML content
    // For Multiple Choice
    choices: [{
      text: String,
      isCorrect: Boolean
    }],
    // For True/False
    correctAnswer: Boolean, // true or false
    // For Fill in Blank
    possibleAnswers: [String], // array of possible correct answers
    caseSensitive: { type: Boolean, default: false },
  },
  { collection: "questions" }
);

export default questionSchema;