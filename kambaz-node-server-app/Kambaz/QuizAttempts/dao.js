import model from "./model.js";

export const findAttemptsForQuiz = (quizId, userId) => {
    return model.find({ quiz: quizId, user: userId }).sort({ attempt: -1 });
};

export const findAttemptById = (attemptId) => {
    return model.findOne({ _id: attemptId });
};

export const createAttempt = (attempt) => {
    if (!attempt._id) {
        attempt._id = Date.now().toString();
    }
    return model.create(attempt);
};

export const getAttemptCount = async (quizId, userId) => {
    return await model.countDocuments({ quiz: quizId, user: userId });
};

export const getLatestAttempt = async (quizId, userId) => {
    return await model.findOne({ quiz: quizId, user: userId }).sort({ attempt: -1 });
};