import { Modal, FormControl, Button } from "react-bootstrap";
import { Row, Col, FormLabel, InputGroup } from "react-bootstrap";
import { SlCalender } from "react-icons/sl";


export default function AssignmentEditor({ show, handleClose, dialogTitle, assignmentName, setAssignmentName, assignmentDescription, setAssignmentDescription, points, setPoints,
  availableFrom, setAvailableFrom, dueDate, setDueDate,
  availableUntil, setAvailableUntil,
  onSave,}: {
 show: boolean; handleClose: () => void; dialogTitle: string; assignmentName: string; setAssignmentName: (name: string) => void;
    assignmentDescription: string; setAssignmentDescription: (desc: string) => void;
    points: number; setPoints: (pts: number) => void;
    availableFrom: string; setAvailableFrom: (date: string) => void;
    dueDate: string; setDueDate: (date: string) => void;
    availableUntil: string; setAvailableUntil: (date: string) => void;
    onSave: () => void;
  }) {
 return (
  <Modal show={show} onHide={handleClose}>
   <Modal.Header closeButton>
    <Modal.Title>{dialogTitle}</Modal.Title>
   </Modal.Header>
   <Modal.Body>
    <label htmlFor="wd-name"><b>Assignment Name</b></label><br/><br/>
      <FormControl id="wd-name" value={assignmentName} 
      onChange={(e) => {setAssignmentName(e.target.value); }}
      className="mb-3" />

      <Row className="mb-3" controlId="textarea2">
        <Col sm={12}>
<FormControl   as="textarea" style={{ height: "100px" }} 
id="wd-description"
value={assignmentDescription}
onChange={(e) => {setAssignmentDescription(e.target.value); }}
       placeholder=" The assignment is available online Submit a link to the landing page of"
      />
      </Col>
      </Row>


            <Row className="mb-3" controlId="points">
              <FormLabel column sm={2}> Points </FormLabel>
            <Col sm={10}>

      
            <FormControl id="wd-points" value={points}
                 onChange={(e) => {setPoints(Number(e.target.value)); }}
             />
            </Col>
            </Row>
  <Row className="mb-3 ">
<Col sm ={2}>
              <FormLabel htmlFor="wd-assign-to">Assign</FormLabel>
                            </Col>
              <Col sm={10}>
    <div className="border rounded p-3 mb-3">


<FormLabel className="mt-3 mb-2"><b>Due</b></FormLabel>
      <Row className="mb-3">

        <Col sm={10}>
            <InputGroup>
            <FormControl  id="wd-due-date" value={dueDate}
             onChange={(e) => {setDueDate(e.target.value); }} />
            <InputGroup.Text><SlCalender /></InputGroup.Text>
          </InputGroup>
        </Col>
      </Row>


      <Row className="mb-3">
    <Col sm={6}>
    <FormLabel className="mb-2"><b>Available from</b></FormLabel>
        
          <InputGroup>
            <FormControl  id="wd-available-from" value={availableFrom}
             onChange={(e) => {setAvailableFrom(e.target.value); }}/>
            <InputGroup.Text><SlCalender /></InputGroup.Text>
          </InputGroup>
        </Col>

    <Col sm={6}>
      <FormLabel className="mb-2"><b>Until</b></FormLabel>
    
          <InputGroup>
  
            <FormControl  id="wd-available-until" value={availableUntil} 
             onChange={(e) => {setAvailableUntil(e.target.value); }} />
            <InputGroup.Text><SlCalender /></InputGroup.Text>
          </InputGroup>
        </Col>
      </Row>
      </div>
           </Col>
      </Row>
   </Modal.Body>
   <Modal.Footer>
    <Button variant="secondary" onClick={handleClose}> Cancel </Button>
    <Button variant="danger"
     onClick={() => {
      onSave();
      handleClose();
     }} > Save </Button>
   </Modal.Footer>
  </Modal>
);}
