import * as questionsDao from "./dao.js";
import * as quizzesDao from "../Quizzes/dao.js";

export default function QuestionsRoutes(app) {

    // Get all questions for a quiz
    const findQuestionsForQuiz = async (req, res) => {
        const { quizId } = req.params;
        const questions = await questionsDao.findQuestionsForQuiz(quizId);
        res.json(questions);
    };

    // Get a specific question
    const findQuestionById = async (req, res) => {
        const { questionId } = req.params;
        const question = await questionsDao.findQuestionById(questionId);
        res.json(question);
    };

    // Create a new question
    const createQuestionForQuiz = async (req, res) => {
        const { quizId } = req.params;
        const question = { ...req.body, quiz: quizId };
        const newQuestion = await questionsDao.createQuestion(question);
        
        // Update quiz total points
        const questions = await questionsDao.findQuestionsForQuiz(quizId);
        const totalPoints = questions.reduce((sum, q) => sum + (q.points || 0), 0);
        await quizzesDao.updateQuiz(quizId, { points: totalPoints });
        
        res.json(newQuestion);
    };

    // Update a question
    const updateQuestion = async (req, res) => {
        const { questionId } = req.params;
        const questionUpdates = req.body;
        await questionsDao.updateQuestion(questionId, questionUpdates);
        const updatedQuestion = await questionsDao.findQuestionById(questionId);
        
        // Update quiz total points
        const quizId = updatedQuestion.quiz;
        const questions = await questionsDao.findQuestionsForQuiz(quizId);
        const totalPoints = questions.reduce((sum, q) => sum + (q.points || 0), 0);
        await quizzesDao.updateQuiz(quizId, { points: totalPoints });
        
        res.json(updatedQuestion);
    };

    // Delete a question
    const deleteQuestion = async (req, res) => {
        const { questionId } = req.params;
        const question = await questionsDao.findQuestionById(questionId);
        const quizId = question.quiz;
        
        const status = await questionsDao.deleteQuestion(questionId);
        
        // Update quiz total points
        const questions = await questionsDao.findQuestionsForQuiz(quizId);
        const totalPoints = questions.reduce((sum, q) => sum + (q.points || 0), 0);
        await quizzesDao.updateQuiz(quizId, { points: totalPoints });
        
        res.json(status);
    };

    app.get("/api/quizzes/:quizId/questions", findQuestionsForQuiz);
    app.get("/api/questions/:questionId", findQuestionById);
    app.post("/api/quizzes/:quizId/questions", createQuestionForQuiz);
    app.put("/api/questions/:questionId", updateQuestion);
    app.delete("/api/questions/:questionId", deleteQuestion);
}