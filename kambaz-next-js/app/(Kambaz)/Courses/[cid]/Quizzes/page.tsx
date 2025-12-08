"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button, ListGroup, ListGroupItem, Dropdown } from "react-bootstrap";
import { BsThreeDotsVertical, BsPlus } from "react-icons/bs";
import { FaBan, FaCheckCircle } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "@/app/(Kambaz)/store";
import * as client from "./client";

export default function Quizzes() {
  const { cid } = useParams();
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const isFaculty = currentUser?.role === "FACULTY";

  const fetchQuizzes = async () => {
    const data = await client.findQuizzesForCourse(cid as string);
    
    // Sort by available date (most recent first)
    const sorted = data.sort((a: any, b: any) => {
      const dateA = a.availableDate ? new Date(a.availableDate).getTime() : 0;
      const dateB = b.availableDate ? new Date(b.availableDate).getTime() : 0;
      return dateB - dateA; // Descending order (newest first)
    });
    
    setQuizzes(sorted);
  };

  useEffect(() => {
    fetchQuizzes();
  }, [cid]);

  const handleAddQuiz = async () => {
    const newQuiz = {
      title: "New Quiz",
      description: "",
      quizType: "GRADED_QUIZ",
      points: 0,
      published: false,
    };
    const created = await client.createQuizForCourse(cid as string, newQuiz);
    window.location.href = `/Courses/${cid}/Quizzes/${created._id}`;
  };

  const handleDelete = async (quizId: string) => {
    await client.deleteQuiz(quizId);
    fetchQuizzes();
  };

const handleTogglePublish = async (quiz: any, e?: React.MouseEvent) => {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
  await client.togglePublishQuiz(quiz._id, !quiz.published);
  fetchQuizzes();
};

  const getAvailabilityStatus = (quiz: any) => {
    const now = new Date();
    const availableDate = quiz.availableDate ? new Date(quiz.availableDate) : null;
    const untilDate = quiz.untilDate ? new Date(quiz.untilDate) : null;

    if (untilDate && now > untilDate) return "Closed";
    if (availableDate && now < availableDate) return `Not available until ${quiz.availableDate}`;
    return "Available";
  };

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Quizzes</h2>
        {isFaculty && (
          <Button variant="danger" onClick={handleAddQuiz}>
            <BsPlus size={20} /> Quiz
          </Button>
        )}
      </div>

      {quizzes.length === 0 ? (
        <p className="text-muted">No quizzes yet. {isFaculty && "Click '+ Quiz' to create one."}</p>
      ) : (
        <ListGroup>
          {quizzes.map((quiz) => (
            <ListGroupItem key={quiz._id} className="d-flex justify-content-between align-items-start">
              <div className="flex-grow-1">
                <div className="d-flex align-items-center gap-2">
              {isFaculty ? (
                    <span 
                      onClick={(e) => handleTogglePublish(quiz, e)}
                      style={{ cursor: 'pointer' }}
                      title={quiz.published ? "Click to unpublish" : "Click to publish"}
                    >
                      {quiz.published ? (
                        <FaCheckCircle className="text-success" />
                      ) : (
                        <FaBan className="text-danger" />
                      )}
                    </span>
                  ) : (
                    // Students just see the icon (not clickable)
                    quiz.published ? (
                      <FaCheckCircle className="text-success" title="Published" />
                    ) : (
                      <FaBan className="text-danger" title="Unpublished" />
                    )
                  )}
                  <Link 
                    href={`/Courses/${cid}/Quizzes/${quiz._id}`}
                    className="fw-bold text-decoration-none"
                  >
                    {quiz.title}
                  </Link>
                </div>
                <div className="text-muted small mt-1">
                  <div><strong>Availability:</strong> {getAvailabilityStatus(quiz)}</div>
                  <div><strong>Due:</strong> {quiz.dueDate || "No due date"}</div>
                  <div><strong>Points:</strong> {quiz.points} | <strong>Questions:</strong> {quiz.questionCount || 0}</div>
                  {!isFaculty && quiz.lastAttemptScore !== undefined && (
                    <div className="text-primary"><strong>Score:</strong> {quiz.lastAttemptScore} / {quiz.points}</div>
                  )}
                </div>
              </div>

              {isFaculty && (
                <Dropdown>
                  <Dropdown.Toggle variant="light" size="sm">
                    <BsThreeDotsVertical />
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item href={`/Courses/${cid}/Quizzes/${quiz._id}/edit`}>
                      Edit
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => handleDelete(quiz._id)}>
                      Delete
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => handleTogglePublish(quiz)}>
                      {quiz.published ? "Unpublish" : "Publish"}
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              )}
            </ListGroupItem>
          ))}
        </ListGroup>
      )}
    </div>
  );
}