import mongoose from "mongoose";

const quizAttemptSchema = new mongoose.Schema(
  {
    _id: String,
    quiz: { type: String, ref: "QuizModel" },
    user: { type: String, ref: "UserModel" },
    attempt: { type: Number, default: 1 }, // attempt number
    answers: [{
      question: { type: String, ref: "QuestionModel" },
      answer: mongoose.Schema.Types.Mixed, // can be string, boolean, or array
      isCorrect: Boolean,
      pointsEarned: Number,
    }],
    score: Number,
    submittedAt: { type: Date, default: Date.now },
  },
  { collection: "quiz_attempts" }
);

export default quizAttemptSchema;