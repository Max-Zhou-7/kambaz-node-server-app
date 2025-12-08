"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, Card, Form, Alert, ProgressBar, ButtonGroup } from "react-bootstrap";
import * as quizClient from "../../client";

export default function QuizPreview() {
  const { cid, qid } = useParams();
  const router = useRouter();
  const [quiz, setQuiz] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<{ [key: string]: any }>({});
  const [score, setScore] = useState<number | null>(null);
  const [graded, setGraded] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    fetchQuizData();
  }, [qid]);

  const fetchQuizData = async () => {
    const quizData = await quizClient.findQuizById(qid as string);
    const questionsData = await quizClient.findQuestionsForQuiz(qid as string);
    setQuiz(quizData);
    setQuestions(questionsData);
  };

  const handleAnswerChange = (questionId: string, answer: any) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const handleSubmit = () => {
    let totalScore = 0;
    
    questions.forEach((question) => {
      const userAnswer = answers[question._id];
      let isCorrect = false;

      if (question.type === "MULTIPLE_CHOICE") {
        const correctChoice = question.choices?.find((c: any) => c.isCorrect);
        isCorrect = userAnswer === correctChoice?.text;
      } else if (question.type === "TRUE_FALSE") {
        isCorrect = userAnswer === question.correctAnswer;
      } else if (question.type === "FILL_IN_BLANK") {
        const userAns = question.caseSensitive ? userAnswer : userAnswer?.toLowerCase();
        isCorrect = question.possibleAnswers?.some((possible: string) => {
          const possibleAns = question.caseSensitive ? possible : possible.toLowerCase();
          return userAns?.trim() === possibleAns.trim();
        });
      }

      if (isCorrect) {
        totalScore += question.points;
      }
    });

    setScore(totalScore);
    setGraded(true);
  };

  const getQuestionResult = (question: any) => {
    if (!graded) return null;

    const userAnswer = answers[question._id];
    let isCorrect = false;

    if (question.type === "MULTIPLE_CHOICE") {
      const correctChoice = question.choices?.find((c: any) => c.isCorrect);
      isCorrect = userAnswer === correctChoice?.text;
    } else if (question.type === "TRUE_FALSE") {
      isCorrect = userAnswer === question.correctAnswer;
    } else if (question.type === "FILL_IN_BLANK") {
      const userAns = question.caseSensitive ? userAnswer : userAnswer?.toLowerCase();
      isCorrect = question.possibleAnswers?.some((possible: string) => {
        const possibleAns = question.caseSensitive ? possible : possible.toLowerCase();
        return userAns?.trim() === possibleAns.trim();
      });
    }

    return isCorrect;
  };

  const renderQuestion = (question: any, index: number, showResult: boolean = false) => {
    const isCorrect = showResult ? getQuestionResult(question) : null;

    return (
      <Card 
        key={question._id} 
        className="mb-3"
        border={isCorrect !== null ? (isCorrect ? "success" : "danger") : undefined}
      >
        <Card.Body>
          <div className="d-flex justify-content-between">
            <Card.Title>
              Question {index + 1} ({question.points} pts)
            </Card.Title>
            {isCorrect !== null && (
              <span className={`badge bg-${isCorrect ? 'success' : 'danger'}`}>
                {isCorrect ? '✓ Correct' : '✗ Incorrect'}
              </span>
            )}
          </div>
          <div className="mb-3" dangerouslySetInnerHTML={{ __html: question.question }} />

          {showResult && (
            <div className="bg-light p-3 rounded mb-2">
              <strong>Your answer:</strong> {String(answers[question._id] || "No answer")}
            </div>
          )}

          {!showResult && question.type === "MULTIPLE_CHOICE" && (
            <div>
              {question.choices?.map((choice: any, i: number) => (
                <Form.Check
                  key={i}
                  type="radio"
                  label={choice.text}
                  name={`question-${question._id}`}
                  checked={answers[question._id] === choice.text}
                  onChange={() => handleAnswerChange(question._id, choice.text)}
                />
              ))}
            </div>
          )}

          {!showResult && question.type === "TRUE_FALSE" && (
            <div>
              <Form.Check
                type="radio"
                label="True"
                name={`question-${question._id}`}
                checked={answers[question._id] === true}
                onChange={() => handleAnswerChange(question._id, true)}
              />
              <Form.Check
                type="radio"
                label="False"
                name={`question-${question._id}`}
                checked={answers[question._id] === false}
                onChange={() => handleAnswerChange(question._id, false)}
              />
            </div>
          )}

          {!showResult && question.type === "FILL_IN_BLANK" && (
            <Form.Control
              type="text"
              value={answers[question._id] || ""}
              onChange={(e) => handleAnswerChange(question._id, e.target.value)}
              placeholder="Enter your answer"
            />
          )}

          {showResult && !isCorrect && (
            <div className="text-success mt-2">
              <strong>Correct answer:</strong>{" "}
              {question.type === "MULTIPLE_CHOICE" && question.choices?.find((c: any) => c.isCorrect)?.text}
              {question.type === "TRUE_FALSE" && String(question.correctAnswer)}
              {question.type === "FILL_IN_BLANK" && question.possibleAnswers?.join(", ")}
            </div>
          )}
        </Card.Body>
      </Card>
    );
  };

  // Loading state
  if (!quiz || !questions || questions.length === 0) {
    return <div className="p-4">Loading...</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  // Safety check for currentQuestion
  if (!currentQuestion) {
    return <div className="p-4">No questions available for this quiz.</div>;
  }

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>{quiz.title} - Preview</h2>
          <p className="text-muted">This is a preview. Results will not be saved.</p>
        </div>
        <Button variant="secondary" onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/edit`)}>
          Edit Quiz
        </Button>
      </div>

      {graded && (
        <Alert variant="info" className="mb-4">
          <h4>Your Score: {score} / {quiz.points}</h4>
          <p>Percentage: {((score! / quiz.points) * 100).toFixed(2)}%</p>
        </Alert>
      )}

      {!graded && quiz.oneQuestionAtATime ? (
        // One question at a time mode
        <>
          <ProgressBar 
            now={((currentQuestionIndex + 1) / questions.length) * 100} 
            label={`${currentQuestionIndex + 1} / ${questions.length}`}
            className="mb-3"
          />

          {/* Question Navigation */}
          <div className="mb-3">
            <ButtonGroup>
              {questions.map((_, index) => (
                <Button
                  key={index}
                  variant={currentQuestionIndex === index ? "primary" : "outline-secondary"}
                  size="sm"
                  onClick={() => setCurrentQuestionIndex(index)}
                >
                  {index + 1}
                </Button>
              ))}
            </ButtonGroup>
          </div>

          {renderQuestion(currentQuestion, currentQuestionIndex)}

          <div className="d-flex justify-content-between mt-4">
            <Button 
              variant="secondary" 
              onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </Button>

            {currentQuestionIndex < questions.length - 1 ? (
              <Button 
                variant="primary" 
                onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
              >
                Next
              </Button>
            ) : (
              <Button variant="danger" onClick={handleSubmit}>
                Submit Preview
              </Button>
            )}
          </div>
        </>
      ) : !graded ? (
        // All questions at once mode
        <>
          <p className="text-muted mb-3">Answer all questions and submit when ready.</p>
          {questions.map((question, index) => renderQuestion(question, index))}
          <Button variant="danger" size="lg" onClick={handleSubmit}>
            Submit Preview
          </Button>
        </>
      ) : null}

      {graded && (
        <>
          {questions.map((question, index) => renderQuestion(question, index, true))}
          <Button variant="primary" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </>
      )}
    </div>
  );
}