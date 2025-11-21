import { IoEllipsisVertical } from "react-icons/io5";
import { BsPlus } from "react-icons/bs";
import { Button} from "react-bootstrap";

export default function AssignmentControlButtons() {
  return (
    <div className="d-flex align-items-center  ms-auto">
              <div className=" wd-rounded-corners-all-around 
        wd-border-thin wd-border-solid wd-padding-fat  mb-0 small">
        40% of Total </div>
    
          <Button variant="secondary" ><BsPlus/></Button>
           <span className="me-1 position-relative">
            <IoEllipsisVertical className="fs-4" />
          </span>




    </div>
  );
}