import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  quizzes: [],
  questions: [],
  currentQuiz: null,
};

const quizzesSlice = createSlice({
  name: "quizzes",
  initialState,
  reducers: {
    setQuizzes: (state, action) => {
      state.quizzes = action.payload;
    },
    setQuestions: (state, action) => {
      state.questions = action.payload;
    },
    setCurrentQuiz: (state, action) => {
      state.currentQuiz = action.payload;
    },
    addQuiz: (state: any, action) => {
      state.quizzes = [...state.quizzes, action.payload];
    },
    updateQuiz: (state: any, action) => {
      state.quizzes = state.quizzes.map((q: any) =>
        q._id === action.payload._id ? action.payload : q
      );
    },
    deleteQuiz: (state: any, action: PayloadAction<string>) => {
      state.quizzes = state.quizzes.filter((q: any) => q._id !== action.payload);
    },
    addQuestion: (state: any, action) => {
      state.questions = [...state.questions, action.payload];
    },
    updateQuestion: (state: any, action) => {
      state.questions = state.questions.map((q: any) =>
        q._id === action.payload._id ? action.payload : q
      );
    },
    deleteQuestion: (state: any, action: PayloadAction<string>) => {
      state.questions = state.questions.filter((q: any) => q._id !== action.payload);
    },
  },
});

export const {
  setQuizzes,
  setQuestions,
  setCurrentQuiz,
  addQuiz,
  updateQuiz,
  deleteQuiz,
  addQuestion,
  updateQuestion,
  deleteQuestion,
} = quizzesSlice.actions;

export default quizzesSlice.reducer;