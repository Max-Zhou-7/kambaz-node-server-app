"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ListGroup, ListGroupItem } from "react-bootstrap";
export default function CourseNavigation({cid}: {cid: string}) {
  const pathname = usePathname();
  const links = [
    { label: "Home",        path: `/Courses/${cid}/Home` },
    { label: "Modules",     path: `/Courses/${cid}/Modules` },
    { label: "Piazza",     path: `/Courses/${cid}/Piazza` },
    { label: "Zoom",       path: `/Courses/${cid}/Zoom` },
    { label: "Assignments", path: `/Courses/${cid}/Assignments` },
    { label: "Quizzes",    path: `/Courses/${cid}/Quizzes` },
    { label: "Grades",     path: `/Courses/${cid}/Grades` },
    { label: "People",     path: `/Courses/${cid}/People/Table` },
  ];
  return (
    <ListGroup id="wd-courses-navigation" className="wd list-group fs-5 rounded-0">
         
      {links.map((link) => (
        <ListGroupItem key={link.path} as={Link} href={link.path}
          className={ pathname.includes(link.label) 
          ? "list-group-item active border-0" : "list-group-item text-danger border-0"}>
      
          {link.label}
        </ListGroupItem>
      ))}
    </ListGroup>
  );}
