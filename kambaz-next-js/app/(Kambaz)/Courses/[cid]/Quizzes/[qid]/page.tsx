"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, Card, ListGroup } from "react-bootstrap";
import * as client from "../client";
import { useSelector } from "react-redux";
import { RootState } from "@/app/(Kambaz)/store";

export default function QuizDetails() {
  const { cid, qid } = useParams();
  const router = useRouter();
  const [quiz, setQuiz] = useState<any>(null);
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const isFaculty = currentUser?.role === "FACULTY";

  const fetchQuiz = async () => {
    const data = await client.findQuizById(qid as string);
    setQuiz(data);
  };

  useEffect(() => {
    fetchQuiz();
  }, [qid]);

  const handleTogglePublish = async () => {
    if (!quiz) return;
    await client.togglePublishQuiz(quiz._id, !quiz.published);
    fetchQuiz();
  };

  if (!quiz) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>{quiz.title}</h2>
        <div className="d-flex gap-2">
          {isFaculty && (
            <>
              <Button 
                variant={quiz.published ? "warning" : "success"}
                onClick={handleTogglePublish}
              >
                {quiz.published ? "Unpublish" : "Publish"}
              </Button>
              <Button 
                variant="outline-secondary" 
                onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/preview`)}
              >
                Preview
              </Button>
              <Button 
                variant="primary" 
                onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/edit`)}
              >
                Edit
              </Button>
            </>
          )}
          {!isFaculty && quiz.published && (
            <Button 
              variant="danger" 
              onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/take`)}
            >
              Take Quiz
            </Button>
          )}
        </div>
      </div>

      <Card>
        <Card.Body>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <strong>Quiz Type:</strong> {quiz.quizType?.replace('_', ' ')}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Points:</strong> {quiz.points}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Assignment Group:</strong> {quiz.assignmentGroup}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Shuffle Answers:</strong> {quiz.shuffleAnswers ? "Yes" : "No"}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Time Limit:</strong> {quiz.timeLimit} Minutes
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Multiple Attempts:</strong> {quiz.multipleAttempts ? "Yes" : "No"}
            </ListGroup.Item>
            {quiz.multipleAttempts && (
              <ListGroup.Item>
                <strong>How Many Attempts:</strong> {quiz.howManyAttempts}
              </ListGroup.Item>
            )}
            <ListGroup.Item>
              <strong>Show Correct Answers:</strong> {quiz.showCorrectAnswers}
            </ListGroup.Item>
            {quiz.accessCode && (
              <ListGroup.Item>
                <strong>Access Code:</strong> {quiz.accessCode}
              </ListGroup.Item>
            )}
            <ListGroup.Item>
              <strong>One Question at a Time:</strong> {quiz.oneQuestionAtATime ? "Yes" : "No"}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Webcam Required:</strong> {quiz.webcamRequired ? "Yes" : "No"}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Lock Questions After Answering:</strong> {quiz.lockQuestionsAfterAnswering ? "Yes" : "No"}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Due Date:</strong> {quiz.dueDate || "Not set"}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Available From:</strong> {quiz.availableDate || "Not set"}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Until:</strong> {quiz.untilDate || "Not set"}
            </ListGroup.Item>
          </ListGroup>
        </Card.Body>
      </Card>
    </div>
  );
}