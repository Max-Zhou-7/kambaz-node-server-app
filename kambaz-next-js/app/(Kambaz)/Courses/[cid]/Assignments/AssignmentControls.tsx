"use client";
import { Button, InputGroup, FormControl } from "react-bootstrap";
import { FaPlus } from "react-icons/fa6";
import { HiMagnifyingGlass } from "react-icons/hi2";
import AssignmentEditor from "./AssignmentEditor";


export default function AssignmentControls(
  {assignmentName, setAssignmentName, addAssignment, updateAssignment: updateAssignmentProp, assignmentDescription, setAssignmentDescription, points, setPoints,
    availableFrom, setAvailableFrom, dueDate, setDueDate,
    availableUntil, setAvailableUntil,
    showModal, handleCloseModal, handleOpenModal, isEditing,
  }: { assignmentName: string; setAssignmentName: (name: string) => void;
    addAssignment: () => void; updateAssignment: () => void;
    assignmentDescription: string; setAssignmentDescription: (desc: string) => void;
    points: number; setPoints: (pts: number) => void;
    availableFrom: string; setAvailableFrom: (date: string) => void;
    dueDate: string; setDueDate: (date: string) => void;
    availableUntil: string; setAvailableUntil: (date: string) => void;
    showModal: boolean; handleCloseModal: () => void;
    handleOpenModal: () => void;
    isEditing: boolean;
  }
) {


  return (

    <div id="wd-assignments-controls" className="text-nowrap">


      <Button variant="danger" onClick = {handleOpenModal} size="lg" className="me-1 float-end" id="wd-add-assignment-btn">
       <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} /> Assignment</Button>
    <Button variant = "secondary" size = "lg" className="me-1 float-end" id="wd-add-assignment-group-btn"> 
         <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />     Group</Button>
 
    <InputGroup className="me-1 "  style={{ width: "250px" }}>
        <InputGroup.Text className="fs-1 p-2"><HiMagnifyingGlass /> </InputGroup.Text>
   <FormControl placeholder="Search..." id="wd-search-assignment" />
</InputGroup>
<AssignmentEditor show={showModal} handleClose={handleCloseModal} dialogTitle={isEditing ? "Edit Assignment" : "Add Assignment"}
       assignmentName={assignmentName} setAssignmentName={setAssignmentName} 
       onSave={isEditing ? updateAssignmentProp : addAssignment} 
       assignmentDescription = {assignmentDescription}
       setAssignmentDescription = {setAssignmentDescription}
        points={points} setPoints={setPoints}
       availableFrom={availableFrom} setAvailableFrom={setAvailableFrom}
       dueDate={dueDate} setDueDate={setDueDate}
       availableUntil={availableUntil} setAvailableUntil={setAvailableUntil}
       
       />

 </div>

  );
}