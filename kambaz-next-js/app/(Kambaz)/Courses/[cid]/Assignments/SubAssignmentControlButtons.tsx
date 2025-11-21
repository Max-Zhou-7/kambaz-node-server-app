import { IoEllipsisVertical } from "react-icons/io5";
import GreenCheckmark from "../Modules/GreenCheckmark";
import { FaTrash } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";

export default function SubAssignmentControlButton({ 
  assignmentId, 
  deleteAssignment,
  editAssignment 
}: {
  assignmentId: string;
  deleteAssignment: (assignmentId: string) => void;
  editAssignment: (assignmentId: string) => void;
}) {
  return (
    <div className="float-end">
      <FaPencil 
        className="text-primary me-3" 
        style={{ cursor: "pointer" }}
        onClick={() => editAssignment(assignmentId)}
      />
      <FaTrash 
        className="text-danger me-2 mb-1" 
        style={{ cursor: "pointer" }}
        onClick={() => deleteAssignment(assignmentId)}
      />
      <GreenCheckmark />
      <IoEllipsisVertical className="fs-4" />
    </div>
  );
}