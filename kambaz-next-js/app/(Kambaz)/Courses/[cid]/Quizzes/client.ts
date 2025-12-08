import axios from "axios";
const axiosWithCredentials = axios.create({ withCredentials: true});
const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
const COURSES_API = `${HTTP_SERVER}/api/courses`;
const QUIZZES_API = `${HTTP_SERVER}/api/quizzes`;
const QUESTIONS_API = `${HTTP_SERVER}/api/questions`;

// Quizzes
export const findQuizzesForCourse = async (courseId: string) => {
    const response = await axios.get(`${COURSES_API}/${courseId}/quizzes`);
    return response.data;
};

export const findQuizById = async (quizId: string) => {
    const response = await axios.get(`${QUIZZES_API}/${quizId}`);
    return response.data;
};

export const createQuizForCourse = async (courseId: string, quiz: any) => {
    const response = await axios.post(`${COURSES_API}/${courseId}/quizzes`, quiz);
    return response.data;
};

export const updateQuiz = async (quiz: any) => {
    const response = await axios.put(`${QUIZZES_API}/${quiz._id}`, quiz);
    return response.data;
};

export const deleteQuiz = async (quizId: string) => {
    const response = await axios.delete(`${QUIZZES_API}/${quizId}`);
    return response.data;
};

export const togglePublishQuiz = async (quizId: string, published: boolean) => {
    const response = await axios.put(`${QUIZZES_API}/${quizId}/publish`, { published });
    return response.data;
};

// Questions
export const findQuestionsForQuiz = async (quizId: string) => {
    const response = await axios.get(`${QUIZZES_API}/${quizId}/questions`);
    return response.data;
};

export const createQuestionForQuiz = async (quizId: string, question: any) => {
    const response = await axios.post(`${QUIZZES_API}/${quizId}/questions`, question);
    return response.data;
};

export const updateQuestion = async (question: any) => {
    const response = await axios.put(`${QUESTIONS_API}/${question._id}`, question);
    return response.data;
};

export const deleteQuestion = async (questionId: string) => {
    const response = await axios.delete(`${QUESTIONS_API}/${questionId}`);
    return response.data;
};

// Quiz Attempts
export const findAttemptsForQuiz = async (quizId: string) => {
    const response = await axiosWithCredentials.get(`${QUIZZES_API}/${quizId}/attempts`);
    return response.data;
};

export const getLatestAttempt = async (quizId: string) => {
    const response = await axiosWithCredentials.get(`${QUIZZES_API}/${quizId}/attempts/latest`);
    return response.data;
};

export const submitQuizAttempt = async (quizId: string, answers: any[]) => {
    const response = await axiosWithCredentials.post(`${QUIZZES_API}/${quizId}/attempts`, { answers });
    return response.data;
};


