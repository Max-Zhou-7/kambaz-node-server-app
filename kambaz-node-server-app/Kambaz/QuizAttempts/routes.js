import * as attemptsDao from "./dao.js";
import * as questionsDao from "../Questions/dao.js";
import * as quizzesDao from "../Quizzes/dao.js";

export default function QuizAttemptsRoutes(app) {

    // Get all attempts for a quiz by current user
    const findAttemptsForQuiz = async (req, res) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            res.sendStatus(401);
            return;
        }
        const { quizId } = req.params;
        const attempts = await attemptsDao.findAttemptsForQuiz(quizId, currentUser._id);
        res.json(attempts);
    };

    // Get latest attempt
    const getLatestAttempt = async (req, res) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            res.sendStatus(401);
            return;
        }
        const { quizId } = req.params;
        const attempt = await attemptsDao.getLatestAttempt(quizId, currentUser._id);
        res.json(attempt || null);
    };

    // Submit quiz attempt
    const submitQuizAttempt = async (req, res) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            res.sendStatus(401);
            return;
        }

        const { quizId } = req.params;
        const { answers } = req.body; // array of { question: id, answer: value }

        // Get quiz and questions
        const quiz = await quizzesDao.findQuizById(quizId);
        const questions = await questionsDao.findQuestionsForQuiz(quizId);

        // Check attempt count
        const attemptCount = await attemptsDao.getAttemptCount(quizId, currentUser._id);
        if (attemptCount >= quiz.howManyAttempts) {
            res.status(403).json({ error: "Maximum attempts reached" });
            return;
        }

        // Grade the answers
        let totalScore = 0;
        const gradedAnswers = answers.map(ans => {
            const question = questions.find(q => q._id === ans.question);
            if (!question) return { ...ans, isCorrect: false, pointsEarned: 0 };

            let isCorrect = false;
            if (question.type === "MULTIPLE_CHOICE") {
                const correctChoice = question.choices.find(c => c.isCorrect);
                isCorrect = ans.answer === correctChoice?.text;
            } else if (question.type === "TRUE_FALSE") {
                isCorrect = ans.answer === question.correctAnswer;
            } else if (question.type === "FILL_IN_BLANK") {
                const userAnswer = question.caseSensitive ? ans.answer : ans.answer.toLowerCase();
                isCorrect = question.possibleAnswers.some(possible => {
                    const possibleAnswer = question.caseSensitive ? possible : possible.toLowerCase();
                    return userAnswer.trim() === possibleAnswer.trim();
                });
            }

            const pointsEarned = isCorrect ? question.points : 0;
            totalScore += pointsEarned;

            return {
                question: ans.question,
                answer: ans.answer,
                isCorrect,
                pointsEarned,
            };
        });

        // Create attempt record
        const attempt = {
            quiz: quizId,
            user: currentUser._id,
            attempt: attemptCount + 1,
            answers: gradedAnswers,
            score: totalScore,
        };

        const savedAttempt = await attemptsDao.createAttempt(attempt);
        res.json(savedAttempt);
    };

    app.get("/api/quizzes/:quizId/attempts", findAttemptsForQuiz);
    app.get("/api/quizzes/:quizId/attempts/latest", getLatestAttempt);
    app.post("/api/quizzes/:quizId/attempts", submitQuizAttempt);
}