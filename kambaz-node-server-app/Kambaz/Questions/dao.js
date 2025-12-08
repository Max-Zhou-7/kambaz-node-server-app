import model from "./model.js";

export const findQuestionsForQuiz = (quizId) => {
    return model.find({ quiz: quizId });
};

export const findQuestionById = (questionId) => {
    return model.findOne({ _id: questionId });
};

export const createQuestion = (question) => {
    if (!question._id) {
        question._id = Date.now().toString();
    }
    return model.create(question);
};

export const updateQuestion = (questionId, questionUpdates) => {
    return model.updateOne({ _id: questionId }, { $set: questionUpdates });
};

export const deleteQuestion = (questionId) => {
    return model.deleteOne({ _id: questionId });
};

export const deleteQuestionsForQuiz = (quizId) => {
    return model.deleteMany({ quiz: quizId });
};