"use client";
import { ListGroup, ListGroupItem ,Row, Col, Button, Modal} from "react-bootstrap";
import { BsGripVertical } from "react-icons/bs";
import AssignmentControlButtons from "./AssignmentControlButtons";
import SubAssignmentControlButton from "./SubAssignmentControlButtons";
import AssignmentControls from "./AssignmentControls";
import { FaCaretDown } from "react-icons/fa";
import { LuNotebookPen } from "react-icons/lu";
import Link from "next/link";
import * as db from "../../../Database";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { addAssignment, deleteAssignment, editAssignment, updateAssignment, setAssignment } from "./reducer";
import { RootState } from "../../../store";
import { useState, useEffect } from "react";
import * as client from "../../client";

export default function Assignments() {
  const {assignments} = useSelector((state: RootState) => state.assignmentsReducer);
  const {cid} = useParams();
  const dispatch = useDispatch();

  const [assignmentName, setAssignmentName] = useState("");
  const [assignmentDescription, setAssignmentDescription] = useState("");
  const [points, setPoints] = useState(100);
  const [availableFrom, setAvailableFrom] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [availableUntil, setAvailableUntil] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState<db.Assignment | null>(null);

   const [showModel, setShowModel] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  

  const fetchAssignments = async () => {
    if (!cid) return;
    console.log("Fetching assignments for course:", cid);
    try {
      const assignments = await client.findAssignmentsForCourse(cid as string);
      console.log("Successfully fetched assignments:", assignments);
      dispatch(setAssignment(assignments));
    } catch (error: any) {
      console.error("ERROR fetching assignments:", error);
      console.error("Status:", error.response?.status);
      console.error("Message:", error.response?.data);
    }
  };
  useEffect(() => {
    fetchAssignments();
  }, [cid]);

  const handleDeleteClick = (assignmentId: string) => {
    const assignment = assignments.find((a: any) => a._id === assignmentId);
    if (assignment) {
      setAssignmentToDelete(assignment);
      setShowDeleteModal(true);
    }
  };

  const confirmDelete = async () => {
    if (assignmentToDelete) {
      await client.deleteAssignment(assignmentToDelete._id);
      dispatch(deleteAssignment(assignmentToDelete._id));
      setShowDeleteModal(false);
      setAssignmentToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setAssignmentToDelete(null);
  };

  // Handle add assignment
  const handleAddAssignment = async () => {
    if (!cid) return;
    const courseId = Array.isArray(cid) ? cid[0] : cid;

    const newAssignment = {
      title: assignmentName,
      course: cid as string,
      availableFrom,
      dueDate,
      availableUntil,
      points,
      description: assignmentDescription,
    };

    const createdAssignment = await client.createAssignmentForCourse(courseId, newAssignment);
    dispatch(addAssignment(createdAssignment));
    // Reset form
    setAssignmentName("");
    setAssignmentDescription("");
    setPoints(100);
    setDueDate("");
    setAvailableFrom("");
    setAvailableUntil("");
    setShowModel(false);
  };

  // Handle update assignment
  const handleUpdateAssignment = async () => {
    const assignmentToEdit = assignments.find((a: any) => a.editing);
    if (assignmentToEdit) {
      const updatedAssignmentData = {
        ...assignmentToEdit,
        // _id: assignmentToEdit._id,
        title: assignmentName,
        // course: assignmentToEdit.course,
        description: assignmentDescription,
        points,
        dueDate,
        availableFrom,
        availableUntil:availableUntil,
        editing: false,
      }
      
      const updated = await client.updateAssignment(updatedAssignmentData);
      dispatch(updateAssignment({...updated, editing: false}));
      // Reset form
      setAssignmentName("");
      setAssignmentDescription("");
      setPoints(100);
      setDueDate("");
      setAvailableFrom("");
      setAvailableUntil("");
       setIsEditing(false);  
      setShowModel(false);
    }
  };

  // Handle edit button click
  const handleEditClick = (assignmentId: string) => {
    const assignment = assignments.find((a: any) => a._id === assignmentId);
    if (assignment) {
      // Set editing flag
      dispatch(editAssignment(assignmentId));
      // Populate form with existing data
      setAssignmentName(assignment.title);
      setAssignmentDescription(assignment.description || "");
      setPoints(assignment.points);
      setDueDate(assignment.dueDate);
      setAvailableFrom(assignment.availableFrom);
      setAvailableUntil(assignment.availableUntil || "");
      
      setIsEditing(true);
      setShowModel(true);
    }
  };


    const handleCloseModel = () => {
    setShowModel(false);
    setIsEditing(false);
    

    setAssignmentName("");
    setAssignmentDescription("");
    setPoints(100);
    setDueDate("");
    setAvailableFrom("");
    setAvailableUntil("");
  };


  const handleOpenModel = () => {
    setIsEditing(false);
    setShowModel(true);
  

  };
  return (
    <div>
      <AssignmentControls
      setAssignmentName={setAssignmentName}
      assignmentName = {assignmentName}
      setAssignmentDescription={setAssignmentDescription}
      assignmentDescription={assignmentDescription}
      setPoints={setPoints}
      points={points}
      setAvailableFrom={setAvailableFrom}
      availableFrom={availableFrom}
      setDueDate={setDueDate}
      dueDate={dueDate}
      setAvailableUntil={setAvailableUntil}
      availableUntil={availableUntil}
      addAssignment={handleAddAssignment}
      updateAssignment={handleUpdateAssignment}
      showModal={showModel}
      handleCloseModal={handleCloseModel}
      handleOpenModal={handleOpenModel}
      isEditing={isEditing}
      />

       <br /><br /><br />
  <ListGroup className="rounded-0" id="wd-modules">
    <ListGroupItem className="wd-module p-0 mb-5 fs-5 border-gray">
<div className="wd-title p-3 ps-2 bg-secondary d-flex">

        <BsGripVertical className="me-2 fs-3" />  
        <FaCaretDown className="me-1 fs-20" />
        <b>ASSIGNMENTS</b> 
        <AssignmentControlButtons />
</div>
<ListGroup className="wd-lessons rounded-0">
  {assignments
    // .filter((assignment : db.Assignment) => assignment.course === cid )
    .map((assignment:db.Assignment) => (
      <ListGroupItem key={assignment._id} className="wd-lesson p-3 ps-1">
  <Row className="align-items-center">
    <Col xs="auto">
      <BsGripVertical className="me-2 fs-3" />
      <LuNotebookPen className="me-1" />

    </Col>
    <Col>
      <Link href={`/Courses/${cid}/Assignments/${assignment._id}`} className="wd-assignment-link fw-bold text-secondary text-decoration-none">
        {assignment.title}
      </Link>
      <div className="text-muted small" >
      <span className="text-danger">
        Multiple Modules </span>| <b>Not available until</b> {assignment.availableFrom} |</div>
        <div className="text-muted small">
        <b>Due</b> {assignment.dueDate} | {assignment.points} pts
      </div>
    </Col>
    <Col xs="auto">
      <SubAssignmentControlButton assignmentId={assignment._id}
       deleteAssignment={handleDeleteClick}
       editAssignment = {handleEditClick}  />
    </Col>
  </Row>
  </ListGroupItem>
    ))}

  </ListGroup>
  </ListGroupItem>
     

      </ListGroup>
          <Modal show={showDeleteModal} onHide={cancelDelete} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete Assignment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the assignment{" "}
          <strong>&quot;{assignmentToDelete?.title}&quot;</strong>?
          <br />
          <span className="text-danger">This action cannot be undone.</span>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelDelete}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    
    </div>
);}
