
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardBody, CardImg, CardText, CardTitle, Button, Row, Col, FormControl,} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { addNewCourse, deleteCourse, updateCourse, setCourses } from "../Courses/reducer";
import {v4 as uuidv4} from "uuid";
import * as client from "../Courses/client"
import {RootState} from "../store";
import { enrollCourse, unenrollCourse, toggleShowAllCourses, setEnrollments, } from "./reducer";
import type { Course, Enrollment, User } from "../Database";
import { useRouter } from "next/navigation";



export default function Dashboard() {
 const { courses } = useSelector((state: RootState) => state.coursesReducer as { courses: Course[] });
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.accountReducer) as { currentUser: User | null };
  const { enrollments } = useSelector((state: RootState) => state.enrollmentsReducer) as { enrollments: Enrollment[] };
  const [showAllCourses, setShowAllCourses] = useState<boolean>(false);
  const router = useRouter();
  
    const [course, setCourse] = useState<Course>({
    _id: "0", name: "New Course", number: "New Number",
    startDate: "2023-09-10", endDate: "2023-12-15",
    image: "/images/reactjs.jpg", description: "New Description"
  });
  const fetchCourses = async () => {
    if (!currentUser) {
      return;
    }
    try {
      const courses = await client.findMyCourses();
      dispatch(setCourses(courses));
    
    } catch (error) {
      console.error("Error fetching courses:", error);

    
    };
  };


const fetchEnrollments = async () => {
   if (!currentUser) {
        return;
    }
    try {
        const enrollments = await client.getMyEnrollments();
        dispatch(setEnrollments(enrollments));
    } catch (error) {
        console.error("Error fetching enrollments:", error);
    }
};


  useEffect(() => {
    fetchCourses();
    fetchEnrollments();
  }, [currentUser]);




const onAddNewCourse = async () => {
  try {
    console.log("Creating course:", course);
    const newCourse = await client.createCourse(course);
    console.log("Course created:", newCourse);
    await new Promise(resolve => setTimeout(resolve, 100)); // Wait for DB
    const updatedCourses = await client.findMyCourses();
    console.log("Fetched courses:", updatedCourses);
    dispatch(setCourses(updatedCourses));
  } catch (error) {
    console.error("Error adding course:", error);
  }
};

const onDeleteCourse = async (courseId: string) => {
  try {
    await client.deleteCourse(courseId); // Wait for the delete operation to finish
    console.log("Course deleted successfully.");
    

    const updatedCourses = await client.findMyCourses();
    dispatch(setCourses(updatedCourses));
  } catch (error) {
    console.error("Error deleting course:", error);
  }
}

const onUpdatCourse = async () => {
  try {
    console.log("Updating course:", course);
    await client.updateCourse(course);
    console.log("Course updated");
    await new Promise(resolve => setTimeout(resolve, 100)); // Wait for DB
    const updatedCourses = await client.findMyCourses();
    console.log("Fetched courses after update:", updatedCourses);
    dispatch(setCourses(updatedCourses));
  } catch (error) {
    console.error("Error updating course:", error);
  }
}

  if (!currentUser) {
  return (
    <div id="wd-dashboard">
      <h1>Dashboard</h1>
      <p>Please log in to view your courses.</p>
    </div>
  );
}

 const role = currentUser.role; 
  const enrolledCourses = courses.filter((c: Course) =>
    enrollments.some(
      (enrollment: Enrollment) =>
        enrollment.user === currentUser._id &&
        enrollment.course === c._id
    )
  );  
  const isEnrolled = (courseId: string)=>{
    return enrollments.some(
      (enrollment: Enrollment) =>     
        enrollment.user === currentUser._id &&
        enrollment.course === courseId
    );
  };

  const handleEnroll = async (courseId: string) => {
    try {
        await client.enrollInCourse(courseId);

        const updatedEnrollments = await client.getMyEnrollments();
        dispatch(setEnrollments(updatedEnrollments));
    } catch (error) {
        console.error("Error enrolling in course:", error);
    }
  };

  const handleUnenroll = async (courseId: string) => {
    try {
        await client.unenrollFromCourse(courseId);

        const updatedEnrollments = await client.getMyEnrollments();
        dispatch(setEnrollments(updatedEnrollments));
    } catch (error) {
        console.error("Error unenrolling from course:", error);
    }
  };






  const toggleCoursesView = () => {
    setShowAllCourses(!showAllCourses);
  };









  const enrolledCount = courses.length;
  return (
    role === "FACULTY" ? (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
        <h5>New Course
          <button className="btn btn-primary float-end"
                  id="wd-add-new-course-click"
                  onClick={onAddNewCourse} > Add </button>
                          <button className="btn btn-warning float-end me-2"
                onClick={onUpdatCourse} id="wd-update-course-click">
          Update </button>
      </h5>
      <br />
      <FormControl value={course.name} className="mb-2"
                   onChange={(e) => setCourse({ ...course, name: e.target.value }) } />
      <FormControl value={course.description} rows={3} as="textarea" 
                   onChange={(e) => setCourse({ ...course, description: e.target.value }) }
      />

      <hr />

      <div id="wd-dashboard-courses">
        <Row xs={1} md={5} className="row row-cols-1 row-cols-md-5 g-4"key={courses.length}>
          {courses
          .map((c:Course) => (
            <Col 
            key ={c._id}
            className="wd-dashboard-course" style={{ width: "300px" }}>
              <Card>
  <Link href={`/Courses/${c._id}/Home`}
        className="wd-dashboard-course-link text-decoration-none text-dark">
    <CardImg src={c.image || "/images/reactjs.jpg"} variant="top" width="100%" height={160} />
    <CardBody className="card-body">
      <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">
        {c.name}
      </CardTitle>
      <CardText className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>
        {c.description}
      </CardText>
    </CardBody>
  </Link>
  <CardBody className="pt-0">
    <div className="d-flex justify-content-between">
      <Link href={`/Courses/${c._id}/Home`}>
        <Button variant="primary" className="me-2">Go</Button>
      </Link>
      <button
        id="wd-edit-course-click"
        onClick={e => {
          e.preventDefault();
          setCourse(c);
        }}
        className="btn btn-warning me-2"
      >
        Edit
      </button>
      <button
        onClick={e => {
          e.preventDefault();
          onDeleteCourse(c._id);
        }}
        className="btn btn-danger"
        id="wd-delete-course-click"
      >
        Delete
      </button>
    </div>
  </CardBody>
</Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>)
:(

// Non FACULTY View

    <div id="wd-dashboard">
      <div className="d-flex justify-content-between align-items-center mb-3">
    <h1 id="wd-dashboard-title" className="mb-0">Dashboard</h1>
    <Button variant="primary" onClick={toggleCoursesView} id="wd-view-enrollments-click">
      Enrollments
    </Button>
  </div>
      <hr />  
      <div className = "wd-indent">
      <h2> Published Courses ({enrolledCount}) </h2>
      
      <hr/>
      {showAllCourses ? (

        // ENROLL MODE

<Row xs={1} md={5} className="row row-cols-1 row-cols-md-5 g-4">
          {courses
          .map((c:Course) => (
            <Col 
            key ={c._id}
            className="wd-dashboard-course" style={{ width: "300px" }}>
              <Card>
                <div
                      className="wd-dashboard-course-link text-decoration-none text-dark" >
                  <CardImg src={c.image || "/images/reactjs.jpg"} variant="top" width="100%" height={160} />
                  <CardBody className="card-body">
                    <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">
                      {c.name} </CardTitle>
                    <CardText className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>
                      {c.description} </CardText>
                    {/* <Button variant="primary"> Go </Button> */}
                  { isEnrolled(c._id) ? (
                                <button onClick={(event) => {
                      event.preventDefault();
                      handleUnenroll(c._id);
                    }} className="btn btn-danger float-end w-50 py-1 mb-2 "
                    id="wd-unenroll-course-click">
                    Unenroll
            </button>) : (
              <button onClick={(event) => {
                event.preventDefault();
                handleEnroll(c._id);
              }} className="btn btn-success float-end w-50 py-1 mb-2"
              id="wd-enroll-course-click">
                Enroll
              </button>
            )}

                  </CardBody>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      ):



      (


 <Row xs={1} md={5} className="row row-cols-1 row-cols-md-5 g-4">
          {enrolledCourses
          .map((c:Course) => (
            <Col 
            key ={c._id}
            className="wd-dashboard-course" style={{ width: "300px" }}>
              <Card>
                <Link href={`/Courses/${c._id}/Home`}
                      className="wd-dashboard-course-link text-decoration-none text-dark" >
                  <CardImg src={c.image || "/images/reactjs.jpg"} variant="top" width="100%" height={160} />
                  <CardBody className="card-body">
                    <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">
                      {c.name} </CardTitle>
                    <CardText className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>
                      {c.description} </CardText>
                    {/* <Button variant="primary"> Go </Button> */}
                  {/* { isEnrolled(c._id) ? (
                                <button onClick={(event) => {
                      event.preventDefault();
                      handleUnenroll(c._id);
                    }} className="btn btn-danger float-end w-50 py-1 mb-2 "
                    id="wd-unenroll-course-click">
                    Unenroll
            </button>) : (
              <button onClick={(event) => {
                event.preventDefault();
                handleEnroll(c._id);
              }} className="btn btn-success float-end w-50 py-1 mb-2"
              id="wd-enroll-course-click">
                Enroll
              </button>
            )} */}

                  </CardBody>
                </Link>
              </Card>
            </Col>
          ))}
        </Row>

      )}
    </div>
</div>

));}
