"use client";
import { AiOutlineDashboard } from "react-icons/ai";
import { IoCalendarOutline } from "react-icons/io5";
import { LiaBookSolid, LiaCogSolid } from "react-icons/lia";
import { FaInbox, FaRegCircleUser } from "react-icons/fa6";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import { usePathname } from "next/navigation";  
import Link from "next/link";
export default function KambazNavigation() {
    const pathname = usePathname();
  const links = [
    { label: "Account",   path: "/Account",   icon: FaRegCircleUser },
    { label: "Dashboard", path: "/Dashboard", icon: AiOutlineDashboard },
    { label: "Courses",   path: "/Dashboard", icon: LiaBookSolid },
    { label: "Calendar",  path: "/Calendar",  icon: IoCalendarOutline },
    { label: "Inbox",     path: "/Inbox",     icon: FaInbox },
    { label: "Labs",      path: "/Labs",             icon: LiaCogSolid },
  ];

 return (
    <ListGroup id="wd-kambaz-navigation" style={{width: 120}}
         className="rounded-0 position-fixed bottom-0 top-0 d-none d-md-block bg-black z-2">
      <ListGroupItem id="wd-neu-link" target="_blank" href="https://www.northeastern.edu/"
        action className="bg-black border-0 text-center">
        <img src="/images/NEU.jpg" width="75px" /></ListGroupItem>
      {links.map(({path, label, icon:Icon}) => (
        <ListGroupItem key={label} as={Link} href={path}
          className={`text-center border-0
              ${pathname.includes(label) ? "text-danger bg-white" : "text-white bg-black"}`}>
          {Icon({ className: "fs-1 text-danger"})}
          <br />
          {label}
        </ListGroupItem>
      ))}
    </ListGroup>
);}
