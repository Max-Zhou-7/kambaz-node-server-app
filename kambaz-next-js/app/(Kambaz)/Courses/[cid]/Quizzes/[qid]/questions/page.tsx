"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, Card, Form, ListGroup, Badge } from "react-bootstrap";
import { BsTrash, BsPencil } from "react-icons/bs";
import * as quizClient from "../../client";

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

export default function QuestionsEditor() {
  const { cid, qid } = useParams();
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, [qid]);

  const fetchQuestions = async () => {
    const data = await quizClient.findQuestionsForQuiz(qid as string);
    setQuestions(data);
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

  const handleSaveQuestion = async () => {
    if (!editingQuestion) return;

    if (editingQuestion._id) {
      await quizClient.updateQuestion(editingQuestion);
    } else {
      await quizClient.createQuestionForQuiz(qid as string, editingQuestion);
    }

    setEditingQuestion(null);
    setIsEditing(false);
    fetchQuestions();
  };

  const handleDeleteQuestion = async (questionId: string) => {

      await quizClient.deleteQuestion(questionId);
      fetchQuestions();
    
  };

  const handleCancel = () => {
    setEditingQuestion(null);
    setIsEditing(false);
  };

  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Edit Questions</h2>
          <p className="text-muted">Total Points: {totalPoints}</p>
        </div>
        <div className="d-flex gap-2">
          <Button variant="secondary" onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/edit`)}>
            Back to Quiz
          </Button>
          <Button variant="danger" onClick={handleNewQuestion}>
            + New Question
          </Button>
        </div>
      </div>

      {questions.length === 0 && !isEditing && (
        <p className="text-muted">No questions yet. Click &quot;+ New Question&quot; to add one.</p>
      )}

      <ListGroup className="mb-4">
        {questions.map((question, index) => (
          <ListGroup.Item key={question._id}>
            <div className="d-flex justify-content-between align-items-start">
              <div className="flex-grow-1">
                <div className="d-flex gap-2 align-items-center">
                  <Badge bg="secondary">{index + 1}</Badge>
                  <strong>{question.title}</strong>
                  <Badge bg="info">{question.type.replace('_', ' ')}</Badge>
                  <Badge bg="success">{question.points} pts</Badge>
                </div>
                <div className="mt-2" dangerouslySetInnerHTML={{ __html: question.question }} />
              </div>
              <div className="d-flex gap-2">
                <Button size="sm" variant="outline-primary" onClick={() => handleEditQuestion(question)}>
                  <BsPencil />
                </Button>
                <Button size="sm" variant="outline-danger" onClick={() => handleDeleteQuestion(question._id!)}>
                  <BsTrash />
                </Button>
              </div>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>

      {isEditing && editingQuestion && (
        <QuestionEditor
          question={editingQuestion}
          setQuestion={setEditingQuestion}
          onSave={handleSaveQuestion}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}

interface QuestionEditorProps {
  question: Question;
  setQuestion: (q: Question) => void;
  onSave: () => void;
  onCancel: () => void;
}

function QuestionEditor({ question, setQuestion, onSave, onCancel }: QuestionEditorProps) {
  const handleAddChoice = () => {
    if (question.type === "MULTIPLE_CHOICE" && question.choices) {
      setQuestion({
        ...question,
        choices: [...question.choices, { text: "", isCorrect: false }],
      });
    }
  };

  const handleRemoveChoice = (index: number) => {
    if (question.choices) {
      setQuestion({
        ...question,
        choices: question.choices.filter((_, i) => i !== index),
      });
    }
  };

  const handleChoiceTextChange = (index: number, text: string) => {
    if (question.choices) {
      const newChoices = [...question.choices];
      newChoices[index].text = text;
      setQuestion({ ...question, choices: newChoices });
    }
  };

  const handleChoiceCorrectChange = (index: number) => {
    if (question.choices) {
      const newChoices = question.choices.map((c, i) => ({
        ...c,
        isCorrect: i === index,
      }));
      setQuestion({ ...question, choices: newChoices });
    }
  };

  const handleAddPossibleAnswer = () => {
    setQuestion({
      ...question,
      possibleAnswers: [...(question.possibleAnswers || []), ""],
    });
  };

  const handleRemovePossibleAnswer = (index: number) => {
    setQuestion({
      ...question,
      possibleAnswers: question.possibleAnswers?.filter((_, i) => i !== index),
    });
  };

  const handlePossibleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...(question.possibleAnswers || [])];
    newAnswers[index] = value;
    setQuestion({ ...question, possibleAnswers: newAnswers });
  };

  return (
    <Card className="mb-4">
      <Card.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Question Type</Form.Label>
            <Form.Select
              value={question.type}
              onChange={(e) => {
                const newType = e.target.value as Question["type"];
                const baseQuestion = {
                  ...question,
                  type: newType,
                };

                if (newType === "MULTIPLE_CHOICE") {
                  setQuestion({
                    ...baseQuestion,
                    choices: [
                      { text: "", isCorrect: false },
                      { text: "", isCorrect: false },
                    ],
                  });
                } else if (newType === "TRUE_FALSE") {
                  setQuestion({ ...baseQuestion, correctAnswer: true });
                } else if (newType === "FILL_IN_BLANK") {
                  setQuestion({ ...baseQuestion, possibleAnswers: [""], caseSensitive: false });
                }
              }}
            >
              <option value="MULTIPLE_CHOICE">Multiple Choice</option>
              <option value="TRUE_FALSE">True/False</option>
              <option value="FILL_IN_BLANK">Fill in the Blank</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={question.title}
              onChange={(e) => setQuestion({ ...question, title: e.target.value })}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Points</Form.Label>
            <Form.Control
              type="number"
              value={question.points}
              onChange={(e) => setQuestion({ ...question, points: Number(e.target.value) })}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Question</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={question.question}
              onChange={(e) => setQuestion({ ...question, question: e.target.value })}
              placeholder="Enter your question here..."
            />
          </Form.Group>

          {question.type === "MULTIPLE_CHOICE" && (
            <div className="mb-3">
              <Form.Label>Choices</Form.Label>
              {question.choices?.map((choice, index) => (
                <div key={index} className="d-flex gap-2 mb-2">
                  <Form.Check
                    type="radio"
                    name="correctChoice"
                    checked={choice.isCorrect}
                    onChange={() => handleChoiceCorrectChange(index)}
                    title="Mark as correct answer"
                  />
                  <Form.Control
                    type="text"
                    value={choice.text}
                    onChange={(e) => handleChoiceTextChange(index, e.target.value)}
                    placeholder={`Choice ${index + 1}`}
                  />
                  <Button
                    size="sm"
                    variant="outline-danger"
                    onClick={() => handleRemoveChoice(index)}
                    disabled={question.choices!.length <= 2}
                  >
                    <BsTrash />
                  </Button>
                </div>
              ))}
              <Button size="sm" variant="outline-secondary" onClick={handleAddChoice}>
                + Add Choice
              </Button>
            </div>
          )}

          {question.type === "TRUE_FALSE" && (
            <Form.Group className="mb-3">
              <Form.Label>Correct Answer</Form.Label>
              <div>
                <Form.Check
                  type="radio"
                  label="True"
                  checked={question.correctAnswer === true}
                  onChange={() => setQuestion({ ...question, correctAnswer: true })}
                />
                <Form.Check
                  type="radio"
                  label="False"
                  checked={question.correctAnswer === false}
                  onChange={() => setQuestion({ ...question, correctAnswer: false })}
                />
              </div>
            </Form.Group>
          )}

          {question.type === "FILL_IN_BLANK" && (
            <>
              <div className="mb-3">
                <Form.Label>Possible Correct Answers</Form.Label>
                {question.possibleAnswers?.map((answer, index) => (
                  <div key={index} className="d-flex gap-2 mb-2">
                    <Form.Control
                      type="text"
                      value={answer}
                      onChange={(e) => handlePossibleAnswerChange(index, e.target.value)}
                      placeholder={`Answer ${index + 1}`}
                    />
                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={() => handleRemovePossibleAnswer(index)}
                      disabled={question.possibleAnswers!.length <= 1}
                    >
                      <BsTrash />
                    </Button>
                  </div>
                ))}
                <Button size="sm" variant="outline-secondary" onClick={handleAddPossibleAnswer}>
                  + Add Answer
                </Button>
              </div>
              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  label="Case Sensitive"
                  checked={question.caseSensitive}
                  onChange={(e) => setQuestion({ ...question, caseSensitive: e.target.checked })}
                />
              </Form.Group>
            </>
          )}

          <div className="d-flex gap-2 justify-content-end">
            <Button variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
            <Button variant="primary" onClick={onSave}>
              {question._id ? "Update Question" : "Save Question"}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}