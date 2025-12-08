"use client";
import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Tabs, Tab, Form, Button, Row, Col, Card, ListGroup, Badge, Alert } from "react-bootstrap";
import { BsTrash, BsPencil } from "react-icons/bs";
import * as client from "../../client";

interface Question {
  _id?: string;
  quiz: string;
  title: string;
  type: "MULTIPLE_CHOICE" | "TRUE_FALSE" | "FILL_IN_BLANK";
  points: number;
  question: string;
  choices?: { text: string; isCorrect: boolean }[];
  correctAnswer?: boolean;
  possibleAnswers?: string[];
  caseSensitive?: boolean;
}

export default function QuizEditor() {
  const { cid: rawCid, qid: rawQid } = useParams();
  const cid = Array.isArray(rawCid) ? rawCid[0] : rawCid;
  const qid = Array.isArray(rawQid) ? rawQid[0] : rawQid;
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("details");
  const [quiz, setQuiz] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!qid) return;
      const data = await client.findQuizById(qid);
      setQuiz(data);
    };
    fetchQuiz();
  }, [qid]);

  const fetchQuestions = useCallback(async () => {
    if (!qid) return;
    const data = await client.findQuestionsForQuiz(qid);
    setQuestions(data);
  }, [qid]);

  useEffect(() => {
    if (activeTab === "questions") {
      fetchQuestions();
    }
  }, [activeTab, fetchQuestions]);

  const handleSave = async () => {
    await client.updateQuiz(quiz);
    router.push(`/Courses/${cid}/Quizzes/${qid}`);
  };

  const handleSaveAndPublish = async () => {
    await client.updateQuiz({ ...quiz, published: true });
    router.push(`/Courses/${cid}/Quizzes`);
  };

  const handleNewQuestion = () => {
    setEditingQuestion({
      quiz: qid as string,
      title: "New Question",
      type: "MULTIPLE_CHOICE",
      points: 1,
      question: "",
      choices: [
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
      ],
    });
    setIsEditing(true);
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
    setIsEditing(true);
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (confirm("Are you sure you want to delete this question?")) {
      await client.deleteQuestion(questionId);
      fetchQuestions();
      // Update quiz points
      const updatedQuestions = questions.filter(q => q._id !== questionId);
      const totalPoints = updatedQuestions.reduce((sum, q) => sum + q.points, 0);
      await client.updateQuiz({ ...quiz, points: totalPoints });
    }
  };

  const handleSaveQuestion = async () => {
    if (!editingQuestion || !qid) return;

    if (editingQuestion._id) {
      // Update existing question
      await client.updateQuestion(editingQuestion);
    } else {
      // Create new question
      await client.createQuestionForQuiz(qid, editingQuestion);
    }

    setIsEditing(false);
    setEditingQuestion(null);

    // Refresh questions
    const updatedQuestions = await client.findQuestionsForQuiz(qid);
    setQuestions(updatedQuestions);

    // Update quiz total points
    const totalPoints = updatedQuestions.reduce((sum: number, q: any) => sum + q.points, 0);
    await client.updateQuiz({ ...quiz, points: totalPoints });
    setQuiz({ ...quiz, points: totalPoints });
  };

  const handleCancelQuestion = () => {
    setIsEditing(false);
    setEditingQuestion(null);
  };

  const handleAddChoice = () => {
    if (editingQuestion && editingQuestion.choices) {
      setEditingQuestion({
        ...editingQuestion,
        choices: [...editingQuestion.choices, { text: "", isCorrect: false }],
      });
    }
  };

  const handleRemoveChoice = (index: number) => {
    if (editingQuestion && editingQuestion.choices) {
      const newChoices = editingQuestion.choices.filter((_, i) => i !== index);
      setEditingQuestion({ ...editingQuestion, choices: newChoices });
    }
  };

  const handleChoiceChange = (index: number, text: string) => {
    if (editingQuestion && editingQuestion.choices) {
      const newChoices = [...editingQuestion.choices];
      newChoices[index].text = text;
      setEditingQuestion({ ...editingQuestion, choices: newChoices });
    }
  };

  const handleCorrectChoiceChange = (index: number) => {
    if (editingQuestion && editingQuestion.choices) {
      const newChoices = editingQuestion.choices.map((c, i) => ({
        ...c,
        isCorrect: i === index,
      }));
      setEditingQuestion({ ...editingQuestion, choices: newChoices });
    }
  };

  const handleAddPossibleAnswer = () => {
    if (editingQuestion) {
      const possibleAnswers = editingQuestion.possibleAnswers || [];
      setEditingQuestion({
        ...editingQuestion,
        possibleAnswers: [...possibleAnswers, ""],
      });
    }
  };

  const handleRemovePossibleAnswer = (index: number) => {
    if (editingQuestion && editingQuestion.possibleAnswers) {
      const newAnswers = editingQuestion.possibleAnswers.filter((_, i) => i !== index);
      setEditingQuestion({ ...editingQuestion, possibleAnswers: newAnswers });
    }
  };

  const handlePossibleAnswerChange = (index: number, value: string) => {
    if (editingQuestion && editingQuestion.possibleAnswers) {
      const newAnswers = [...editingQuestion.possibleAnswers];
      newAnswers[index] = value;
      setEditingQuestion({ ...editingQuestion, possibleAnswers: newAnswers });
    }
  };

  if (!quiz) return <div>Loading...</div>;

  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

  return (
    <div className="p-4">
      <h2>Edit Quiz</h2>
      
      <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k || "details")} className="mb-3">
        <Tab eventKey="details" title="Details">
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={quiz.title}
                onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={quiz.description || ""}
                onChange={(e) => setQuiz({ ...quiz, description: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Quiz Type</Form.Label>
              <Form.Select
                value={quiz.quizType}
                onChange={(e) => setQuiz({ ...quiz, quizType: e.target.value })}
              >
                <option value="GRADED_QUIZ">Graded Quiz</option>
                <option value="PRACTICE_QUIZ">Practice Quiz</option>
                <option value="GRADED_SURVEY">Graded Survey</option>
                <option value="UNGRADED_SURVEY">Ungraded Survey</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Points</Form.Label>
              <Form.Control
                type="number"
                value={totalPoints}
                readOnly
                disabled
                className="bg-light"
              />
              <Form.Text className="text-muted">
                Points are automatically calculated from questions ({questions.length} questions)
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Assignment Group</Form.Label>
              <Form.Select
                value={quiz.assignmentGroup}
                onChange={(e) => setQuiz({ ...quiz, assignmentGroup: e.target.value })}
              >
                <option value="QUIZZES">Quizzes</option>
                <option value="EXAMS">Exams</option>
                <option value="ASSIGNMENTS">Assignments</option>
                <option value="PROJECT">Project</option>
              </Form.Select>
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Shuffle Answers"
                    checked={quiz.shuffleAnswers}
                    onChange={(e) => setQuiz({ ...quiz, shuffleAnswers: e.target.checked })}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Time Limit (minutes)</Form.Label>
                  <Form.Control
                    type="number"
                    value={quiz.timeLimit}
                    onChange={(e) => setQuiz({ ...quiz, timeLimit: Number(e.target.value) })}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Allow Multiple Attempts"
                checked={quiz.multipleAttempts}
                onChange={(e) => setQuiz({ ...quiz, multipleAttempts: e.target.checked })}
              />
            </Form.Group>

            {quiz.multipleAttempts && (
              <Form.Group className="mb-3">
                <Form.Label>How Many Attempts</Form.Label>
                <Form.Control
                  type="number"
                  value={quiz.howManyAttempts}
                  onChange={(e) => setQuiz({ ...quiz, howManyAttempts: Number(e.target.value) })}
                />
              </Form.Group>
            )}

            <Form.Group className="mb-3">
              <Form.Label>Show Correct Answers</Form.Label>
              <Form.Control
                type="text"
                value={quiz.showCorrectAnswers || "Immediately"}
                onChange={(e) => setQuiz({ ...quiz, showCorrectAnswers: e.target.value })}
                placeholder="e.g., Immediately, After due date, Never"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Access Code</Form.Label>
              <Form.Control
                type="text"
                value={quiz.accessCode || ""}
                onChange={(e) => setQuiz({ ...quiz, accessCode: e.target.value })}
                placeholder="Leave blank for no access code"
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="One Question at a Time"
                    checked={quiz.oneQuestionAtATime}
                    onChange={(e) => setQuiz({ ...quiz, oneQuestionAtATime: e.target.checked })}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Webcam Required"
                    checked={quiz.webcamRequired}
                    onChange={(e) => setQuiz({ ...quiz, webcamRequired: e.target.checked })}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Lock Questions After Answering"
                checked={quiz.lockQuestionsAfterAnswering}
                onChange={(e) => setQuiz({ ...quiz, lockQuestionsAfterAnswering: e.target.checked })}
              />
            </Form.Group>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Due Date</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    value={quiz.dueDate || ""}
                    onChange={(e) => setQuiz({ ...quiz, dueDate: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Available From</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    value={quiz.availableDate || ""}
                    onChange={(e) => setQuiz({ ...quiz, availableDate: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Until</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    value={quiz.untilDate || ""}
                    onChange={(e) => setQuiz({ ...quiz, untilDate: e.target.value })}
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex gap-2 justify-content-end">
              <Button variant="secondary" onClick={() => router.push(`/Courses/${cid}/Quizzes`)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSave}>
                Save
              </Button>
              <Button variant="success" onClick={handleSaveAndPublish}>
                Save & Publish
              </Button>
            </div>
          </Form>
        </Tab>

        <Tab eventKey="questions" title={`Questions (${questions.length})`}>
          <div className="mb-3 d-flex justify-content-between align-items-center">
            <div>
              <h4>Questions</h4>
              <p className="text-muted">Total Points: {totalPoints}</p>
            </div>
            <Button variant="danger" onClick={handleNewQuestion}>
              + New Question
            </Button>
          </div>

          {questions.length === 0 && !isEditing && (
            <Alert variant="info">
              No questions yet. Click &quot;+ New Question&quot; to add one.
            </Alert>
          )}

          {!isEditing && (
            <ListGroup>
              {questions.map((question, index) => (
                <ListGroup.Item key={question._id} className="d-flex justify-content-between align-items-start">
                  <div className="flex-grow-1">
                    <div className="fw-bold">
                      Question {index + 1}: {question.title}
                      <Badge bg="secondary" className="ms-2">{question.type.replace('_', ' ')}</Badge>
                      <Badge bg="primary" className="ms-2">{question.points} pts</Badge>
                    </div>
                    <div className="text-muted small mt-1" dangerouslySetInnerHTML={{ __html: question.question.substring(0, 100) + (question.question.length > 100 ? '...' : '') }} />
                  </div>
                  <div className="d-flex gap-2">
                    <Button variant="outline-secondary" size="sm" onClick={() => handleEditQuestion(question)}>
                      <BsPencil />
                    </Button>
                    <Button variant="outline-danger" size="sm" onClick={() => handleDeleteQuestion(question._id!)}>
                      <BsTrash />
                    </Button>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}

          {isEditing && editingQuestion && (
            <Card>
              <Card.Body>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Question Title</Form.Label>
                    <Form.Control
                      type="text"
                      value={editingQuestion.title}
                      onChange={(e) => setEditingQuestion({ ...editingQuestion, title: e.target.value })}
                    />
                  </Form.Group>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Question Type</Form.Label>
                        <Form.Select
                          value={editingQuestion.type}
                          onChange={(e) => {
                            const type = e.target.value as "MULTIPLE_CHOICE" | "TRUE_FALSE" | "FILL_IN_BLANK";
                            const base = { ...editingQuestion, type };
                            if (type === "MULTIPLE_CHOICE") {
                              setEditingQuestion({ ...base, choices: [{ text: "", isCorrect: false }, { text: "", isCorrect: false }] });
                            } else if (type === "TRUE_FALSE") {
                              setEditingQuestion({ ...base, correctAnswer: true });
                            } else {
                              setEditingQuestion({ ...base, possibleAnswers: [""], caseSensitive: false });
                            }
                          }}
                        >
                          <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                          <option value="TRUE_FALSE">True/False</option>
                          <option value="FILL_IN_BLANK">Fill in the Blank</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Points</Form.Label>
                        <Form.Control
                          type="number"
                          value={editingQuestion.points}
                          onChange={(e) => setEditingQuestion({ ...editingQuestion, points: Number(e.target.value) })}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>Question</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={editingQuestion.question}
                      onChange={(e) => setEditingQuestion({ ...editingQuestion, question: e.target.value })}
                      placeholder="Enter your question here..."
                    />
                  </Form.Group>

                  {editingQuestion.type === "MULTIPLE_CHOICE" && (
                    <div>
                      <Form.Label>Choices (select correct answer)</Form.Label>
                      {editingQuestion.choices?.map((choice, index) => (
                        <div key={index} className="d-flex gap-2 mb-2">
                          <Form.Check
                            type="radio"
                            name="correct-choice"
                            checked={choice.isCorrect}
                            onChange={() => handleCorrectChoiceChange(index)}
                          />
                          <Form.Control
                            type="text"
                            value={choice.text}
                            onChange={(e) => handleChoiceChange(index, e.target.value)}
                            placeholder={`Choice ${index + 1}`}
                          />
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleRemoveChoice(index)}
                            disabled={(editingQuestion.choices?.length || 0) <= 2}
                          >
                            <BsTrash />
                          </Button>
                        </div>
                      ))}
                      <Button variant="outline-secondary" size="sm" onClick={handleAddChoice}>
                        + Add Choice
                      </Button>
                    </div>
                  )}

                  {editingQuestion.type === "TRUE_FALSE" && (
                    <Form.Group className="mb-3">
                      <Form.Label>Correct Answer</Form.Label>
                      <div>
                        <Form.Check
                          type="radio"
                          label="True"
                          name="true-false-answer"
                          checked={editingQuestion.correctAnswer === true}
                          onChange={() => setEditingQuestion({ ...editingQuestion, correctAnswer: true })}
                        />
                        <Form.Check
                          type="radio"
                          label="False"
                          name="true-false-answer"
                          checked={editingQuestion.correctAnswer === false}
                          onChange={() => setEditingQuestion({ ...editingQuestion, correctAnswer: false })}
                        />
                      </div>
                    </Form.Group>
                  )}

                  {editingQuestion.type === "FILL_IN_BLANK" && (
                    <div>
                      <Form.Group className="mb-3">
                        <Form.Check
                          type="checkbox"
                          label="Case Sensitive"
                          checked={editingQuestion.caseSensitive || false}
                          onChange={(e) => setEditingQuestion({ ...editingQuestion, caseSensitive: e.target.checked })}
                        />
                      </Form.Group>
                      <Form.Label>Possible Correct Answers</Form.Label>
                      {editingQuestion.possibleAnswers?.map((answer, index) => (
                        <div key={index} className="d-flex gap-2 mb-2">
                          <Form.Control
                            type="text"
                            value={answer}
                            onChange={(e) => handlePossibleAnswerChange(index, e.target.value)}
                            placeholder={`Answer ${index + 1}`}
                          />
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleRemovePossibleAnswer(index)}
                            disabled={(editingQuestion.possibleAnswers?.length || 0) <= 1}
                          >
                            <BsTrash />
                          </Button>
                        </div>
                      ))}
                      <Button variant="outline-secondary" size="sm" onClick={handleAddPossibleAnswer}>
                        + Add Answer
                      </Button>
                    </div>
                  )}

                  <div className="d-flex gap-2 mt-4">
                    <Button variant="secondary" onClick={handleCancelQuestion}>
                      Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSaveQuestion}>
                      {editingQuestion._id ? "Update Question" : "Save Question"}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          )}
        </Tab>
      </Tabs>
    </div>
  );
}