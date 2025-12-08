import model from "./model.js";

export const findQuizzesForCourse = (courseId) => {
    return model.find({ course: courseId });
};

export const findQuizById = (quizId) => {
    return model.findOne({ _id: quizId });
};

export const createQuiz = (quiz) => {
    if (!quiz._id) {
        quiz._id = Date.now().toString();
    }
    return model.create(quiz);
};

export const updateQuiz = (quizId, quizUpdates) => {
    return model.updateOne({ _id: quizId }, { $set: quizUpdates });
};

export const deleteQuiz = (quizId) => {
    return model.deleteOne({ _id: quizId });
};

export const publishQuiz = (quizId) => {
    return model.updateOne({ _id: quizId }, { $set: { published: true } });
};

export const unpublishQuiz = (quizId) => {
    return model.updateOne({ _id: quizId }, { $set: { published: false } });
};