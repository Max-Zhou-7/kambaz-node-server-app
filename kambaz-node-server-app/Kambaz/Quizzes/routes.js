import * as quizzesDao from "./dao.js";
import * as questionsDao from "../Questions/dao.js";
import * as attemptsDao from "../QuizAttempts/dao.js";


export default function QuizzesRoutes(app) {

    // Get all quizzes for a course
const findQuizzesForCourseWithScores = async (req, res) => {
    const { courseId } = req.params;
    const currentUser = req.session["currentUser"];
    
    const quizzes = await quizzesDao.findQuizzesForCourse(courseId);
    
    // If user is logged in and is a student, add their latest scores
    if (currentUser && currentUser.role === "STUDENT") {
        const quizzesWithScores = await Promise.all(
            quizzes.map(async (quiz) => {
                const latestAttempt = await attemptsDao.getLatestAttempt(quiz._id, currentUser._id);
                return {
                    ...quiz,
                    lastAttemptScore: latestAttempt ? latestAttempt.score : undefined
                };
            })
        );
        res.json(quizzesWithScores);
    } else {
        res.json(quizzes);
    }
};
    // Get a specific quiz
    const findQuizById = async (req, res) => {
        const { quizId } = req.params;
        const quiz = await quizzesDao.findQuizById(quizId);
        res.json(quiz);
    };

    // Create a new quiz
    const createQuizForCourse = async (req, res) => {
        const { courseId } = req.params;
        const quiz = { ...req.body, course: courseId };
        const newQuiz = await quizzesDao.createQuiz(quiz);
        res.json(newQuiz);
    };

    // Update a quiz
    const updateQuiz = async (req, res) => {
        const { quizId } = req.params;
        const quizUpdates = req.body;
        await quizzesDao.updateQuiz(quizId, quizUpdates);
        const updatedQuiz = await quizzesDao.findQuizById(quizId);
        res.json(updatedQuiz);
    };

    // Delete a quiz
    const deleteQuiz = async (req, res) => {
        const { quizId } = req.params;
        // Also delete all questions for this quiz
        await questionsDao.deleteQuestionsForQuiz(quizId);
        const status = await quizzesDao.deleteQuiz(quizId);
        res.json(status);
    };

    // Publish/Unpublish a quiz
    const togglePublishQuiz = async (req, res) => {
        const { quizId } = req.params;
        const { published } = req.body;
        if (published) {
            await quizzesDao.publishQuiz(quizId);
        } else {
            await quizzesDao.unpublishQuiz(quizId);
        }
        const updatedQuiz = await quizzesDao.findQuizById(quizId);
        res.json(updatedQuiz);
    };



    
    app.get("/api/courses/:courseId/quizzes", findQuizzesForCourseWithScores);
    app.get("/api/quizzes/:quizId", findQuizById);
    app.post("/api/courses/:courseId/quizzes", createQuizForCourse);
    app.put("/api/quizzes/:quizId", updateQuiz);
    app.delete("/api/quizzes/:quizId", deleteQuiz);
    app.put("/api/quizzes/:quizId/publish", togglePublishQuiz);
}