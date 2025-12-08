"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, Card, Form, Alert, ProgressBar, Modal } from "react-bootstrap";
import * as quizClient from "../../client";

export default function TakeQuiz() {
  const { cid, qid } = useParams();
  const router = useRouter();
  const [quiz, setQuiz] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<{ [key: string]: any }>({});
  const [attemptCount, setAttemptCount] = useState(0);
  const [latestAttempt, setLatestAttempt] = useState<any>(null);
  const [submitted, setSubmitted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  // Access code state
  const [showAccessCodeModal, setShowAccessCodeModal] = useState(false);
  const [accessCodeInput, setAccessCodeInput] = useState("");
  const [accessCodeError, setAccessCodeError] = useState("");
  const [accessGranted, setAccessGranted] = useState(false);

  // Timer state
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [timerExpired, setTimerExpired] = useState(false);

  // Lock questions state
  const [lockedQuestions, setLockedQuestions] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetchQuizData();
  }, [qid]);

  const fetchQuizData = async () => {
    const quizData = await quizClient.findQuizById(qid as string);
    const questionsData = await quizClient.findQuestionsForQuiz(qid as string);
    const attempts = await quizClient.findAttemptsForQuiz(qid as string);
    const latest = await quizClient.getLatestAttempt(qid as string);

    setQuiz(quizData);
    setQuestions(questionsData);
    setAttemptCount(attempts.length);
    setLatestAttempt(latest);

    // Check if access code is required
    if (quizData.accessCode && !accessGranted && !latest) {
      setShowAccessCodeModal(true);
    }

    // If there's a latest attempt, show results
    if (latest) {
      setSubmitted(true);
      setAccessGranted(true);
    }

    // Initialize timer if time limit exists
    if (quizData.timeLimit && !latest) {
      setTimeRemaining(quizData.timeLimit * 60); // Convert minutes to seconds
    }
  };

  // Timer countdown effect
  useEffect(() => {
    if (timeRemaining !== null && timeRemaining > 0 && !submitted && accessGranted) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev === null || prev <= 1) {
            setTimerExpired(true);
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeRemaining, submitted, accessGranted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAccessCodeSubmit = () => {
    if (accessCodeInput === quiz.accessCode) {
      setAccessGranted(true);
      setShowAccessCodeModal(false);
      setAccessCodeError("");
    } else {
      setAccessCodeError("Incorrect access code. Please try again.");
    }
  };

  const handleAnswerChange = (questionId: string, answer: any) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const handleQuestionComplete = (questionIndex: number) => {
    if (quiz.lockQuestionsAfterAnswering) {
      setLockedQuestions((prev) => new Set(prev).add(questionIndex));
    }
  };

  const handleSubmit = async () => {
    if (attemptCount >= quiz.howManyAttempts) {
      alert("You have reached the maximum number of attempts");
      return;
    }

    const answersArray = questions.map((q) => ({
      question: q._id,
      answer: answers[q._id],
    }));

    const result = await quizClient.submitQuizAttempt(qid as string, answersArray);
    setLatestAttempt(result);
    setSubmitted(true);
    fetchQuizData();
  };

  const handleRetake = () => {
    if (attemptCount >= quiz.howManyAttempts) {
      alert("You have reached the maximum number of attempts");
      return;
    }
    setAnswers({});
    setSubmitted(false);
    setCurrentQuestionIndex(0);
    setLockedQuestions(new Set());
    setTimerExpired(false);
    
    // Reset timer
    if (quiz.timeLimit) {
      setTimeRemaining(quiz.timeLimit * 60);
    }
    
    // Check access code again for retake
    if (quiz.accessCode) {
      setAccessGranted(false);
      setShowAccessCodeModal(true);
      setAccessCodeInput("");
    }
  };

  const getQuestionResult = (questionId: string) => {
    if (!latestAttempt) return null;
    return latestAttempt.answers.find((a: any) => a.question === questionId);
  };

  const shouldShowCorrectAnswers = () => {
    // Show correct answers based on quiz settings
    // For simplicity, showing immediately after submission
    // You can extend this to check quiz.showCorrectAnswers property
    return submitted && latestAttempt;
  };

  // Loading state
  if (!quiz || !questions || questions.length === 0) {
    return <div className="p-4">Loading...</div>;
  }

  const canTakeQuiz = attemptCount < quiz.howManyAttempts;
  const currentQuestion = questions[currentQuestionIndex];

  // Access Code Modal
  if (showAccessCodeModal) {
    return (
      <Modal show={true} onHide={() => router.push(`/Courses/${cid}/Quizzes`)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Access Code Required</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>This quiz requires an access code to begin.</p>
          <Form.Group>
            <Form.Label>Enter Access Code</Form.Label>
            <Form.Control
              type="password"
              value={accessCodeInput}
              onChange={(e) => setAccessCodeInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAccessCodeSubmit()}
              placeholder="Enter access code"
              isInvalid={!!accessCodeError}
            />
            {accessCodeError && (
              <Form.Control.Feedback type="invalid">
                {accessCodeError}
              </Form.Control.Feedback>
            )}
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => router.push(`/Courses/${cid}/Quizzes`)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAccessCodeSubmit}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  // Show results if submitted
  if (submitted && latestAttempt) {
    return (
      <div className="p-4">
        <h2>{quiz.title} - Results</h2>
        
        <Alert variant="info" className="mb-4">
          <h4>Your Score: {latestAttempt.score} / {quiz.points}</h4>
          <p>Percentage: {((latestAttempt.score / quiz.points) * 100).toFixed(2)}%</p>
          <p>Attempt: {latestAttempt.attempt} of {quiz.howManyAttempts}</p>
          <p>Submitted: {new Date(latestAttempt.submittedAt).toLocaleString()}</p>
          {timerExpired && <p className="text-danger">Time expired - quiz was automatically submitted</p>}
        </Alert>

        {shouldShowCorrectAnswers() && questions.map((question, index) => {
          const result = getQuestionResult(question._id);
          return (
            <Card 
              key={question._id} 
              className="mb-3"
              border={result?.isCorrect ? "success" : "danger"}
            >
              <Card.Body>
                <div className="d-flex justify-content-between">
                  <Card.Title>
                    Question {index + 1} ({question.points} pts)
                  </Card.Title>
                  <span className={`badge bg-${result?.isCorrect ? 'success' : 'danger'}`}>
                    {result?.isCorrect ? '✓ Correct' : '✗ Incorrect'} - {result?.pointsEarned} pts
                  </span>
                </div>
                <div className="mb-3" dangerouslySetInnerHTML={{ __html: question.question }} />

                <div className="bg-light p-3 rounded">
                  <strong>Your answer:</strong> {String(result?.answer)}
                </div>

                {!result?.isCorrect && question.type === "MULTIPLE_CHOICE" && (
                  <div className="mt-2 text-success">
                    <strong>Correct answer:</strong> {question.choices?.find((c: any) => c.isCorrect)?.text}
                  </div>
                )}

                {!result?.isCorrect && question.type === "TRUE_FALSE" && (
                  <div className="mt-2 text-success">
                    <strong>Correct answer:</strong> {String(question.correctAnswer)}
                  </div>
                )}

                {!result?.isCorrect && question.type === "FILL_IN_BLANK" && (
                  <div className="mt-2 text-success">
                    <strong>Possible correct answers:</strong> {question.possibleAnswers?.join(", ")}
                  </div>
                )}
              </Card.Body>
            </Card>
          );
        })}

        <div className="d-flex gap-2">
          <Button variant="secondary" onClick={() => router.push(`/Courses/${cid}/Quizzes`)}>
            Back to Quizzes
          </Button>
          {canTakeQuiz && quiz.multipleAttempts && (
            <Button variant="primary" onClick={handleRetake}>
              Retake Quiz (Attempt {attemptCount + 1} of {quiz.howManyAttempts})
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Safety check for currentQuestion
  if (!currentQuestion) {
    return <div className="p-4">No questions available for this quiz.</div>;
  }

  const isQuestionLocked = lockedQuestions.has(currentQuestionIndex);

  // Show quiz taking interface
  if (quiz.oneQuestionAtATime) {
    // One question at a time mode
    return (
      <div className="p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>{quiz.title}</h2>
          {timeRemaining !== null && (
            <Alert variant={timeRemaining < 60 ? "danger" : "info"} className="mb-0 p-2">
              <strong>Time Remaining:</strong> {formatTime(timeRemaining)}
            </Alert>
          )}
        </div>

        <ProgressBar 
          now={((currentQuestionIndex + 1) / questions.length) * 100} 
          label={`${currentQuestionIndex + 1} / ${questions.length}`}
          className="mb-4"
        />

        <Card>
          <Card.Body>
            <Card.Title>
              Question {currentQuestionIndex + 1} ({currentQuestion.points} pts)
              {isQuestionLocked && <span className="badge bg-warning ms-2">Locked</span>}
            </Card.Title>
            <div className="mb-3" dangerouslySetInnerHTML={{ __html: currentQuestion.question }} />

            {currentQuestion.type === "MULTIPLE_CHOICE" && (
              <div>
                {currentQuestion.choices?.map((choice: any, i: number) => (
                  <Form.Check
                    key={i}
                    type="radio"
                    label={choice.text}
                    name={`question-${currentQuestion._id}`}
                    checked={answers[currentQuestion._id] === choice.text}
                    onChange={() => !isQuestionLocked && handleAnswerChange(currentQuestion._id, choice.text)}
                    disabled={isQuestionLocked}
                  />
                ))}
              </div>
            )}

            {currentQuestion.type === "TRUE_FALSE" && (
              <div>
                <Form.Check
                  type="radio"
                  label="True"
                  name={`question-${currentQuestion._id}`}
                  checked={answers[currentQuestion._id] === true}
                  onChange={() => !isQuestionLocked && handleAnswerChange(currentQuestion._id, true)}
                  disabled={isQuestionLocked}
                />
                <Form.Check
                  type="radio"
                  label="False"
                  name={`question-${currentQuestion._id}`}
                  checked={answers[currentQuestion._id] === false}
                  onChange={() => !isQuestionLocked && handleAnswerChange(currentQuestion._id, false)}
                  disabled={isQuestionLocked}
                />
              </div>
            )}

            {currentQuestion.type === "FILL_IN_BLANK" && (
              <Form.Control
                type="text"
                value={answers[currentQuestion._id] || ""}
                onChange={(e) => !isQuestionLocked && handleAnswerChange(currentQuestion._id, e.target.value)}
                placeholder="Enter your answer"
                disabled={isQuestionLocked}
              />
            )}
          </Card.Body>
        </Card>

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
              onClick={() => {
                handleQuestionComplete(currentQuestionIndex);
                setCurrentQuestionIndex(currentQuestionIndex + 1);
              }}
            >
              {quiz.lockQuestionsAfterAnswering ? "Save & Next" : "Next"}
            </Button>
          ) : (
            <Button variant="danger" onClick={handleSubmit}>
              Submit Quiz
            </Button>
          )}
        </div>
      </div>
    );
  }

  // All questions at once mode
  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>{quiz.title}</h2>
        {timeRemaining !== null && (
          <Alert variant={timeRemaining < 60 ? "danger" : "info"} className="mb-0 p-2">
            <strong>Time Remaining:</strong> {formatTime(timeRemaining)}
          </Alert>
        )}
      </div>
      <p className="text-muted">Answer all questions and submit when ready.</p>

      {questions.map((question, index) => (
        <Card key={question._id} className="mb-3">
          <Card.Body>
            <Card.Title>Question {index + 1} ({question.points} pts)</Card.Title>
            <div className="mb-3" dangerouslySetInnerHTML={{ __html: question.question }} />

            {question.type === "MULTIPLE_CHOICE" && (
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

            {question.type === "TRUE_FALSE" && (
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

            {question.type === "FILL_IN_BLANK" && (
              <Form.Control
                type="text"
                value={answers[question._id] || ""}
                onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                placeholder="Enter your answer"
              />
            )}
          </Card.Body>
        </Card>
      ))}

      <Button variant="danger" size="lg" onClick={handleSubmit}>
        Submit Quiz
      </Button>
    </div>
  );
}