"use client";
import { ReactNode } from "react";
import { FaAlignJustify } from "react-icons/fa6";
import CourseNavigation from "./Navigation";
import { useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import { RootState } from "../../store";
import type { Course } from "../../Database";


export default function CoursesLayout(
  { children }:  { children: ReactNode}) {
  const { cid } = useParams();
  const {courses} = useSelector((state: RootState) => state.coursesReducer);
  const course = courses.find((course:Course) => course._id === cid);
  const [showSidebar, setShowSidebar] = useState(true);
  //   const [isChecking, setIsChecking] = useState(true);

  // const router = useRouter();
  // const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  // const { enrollments } = useSelector((state: RootState) => state.enrollmentsReducer);
//  useEffect(() => {
//   // Don't check enrollment for faculty
//   if (currentUser?.role === "FACULTY") {
//     setIsChecking(false);
//     return;
//   }

//   // Wait for enrollments to load
//   const timer = setTimeout(() => {
//     if (currentUser) {
//       const isEnrolled = enrollments.some(
//         (e: any) => e.user === currentUser._id && e.course === cid
//       );
//       if (!isEnrolled) {
//         alert("You are not enrolled in this course.");
//         router.push("/Kambaz/Dashboard");
//       }
//     }
//     setIsChecking(false);
//   }, 200);

//   return () => clearTimeout(timer);
// }, [currentUser, enrollments, cid, router]);

 return (
      <div id="wd-courses">
      <h2 className="text-danger">
    <Button variant="link" className="text-danger p-0 border-0" 
    onClick={()=> setShowSidebar(!showSidebar)}><FaAlignJustify className="me-4 fs-4 mb-1" />
    </Button>
      {course?.name || "Course Not Found"}
      </h2>
       <hr />

  <div className="d-flex">
    <div className="d-none d-md-block">
      {showSidebar && <CourseNavigation cid={cid as string} />}

    </div>
    <div className="flex-fill">
      {children}
    </div>
    </div>

   </div>
);}
