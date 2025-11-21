"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentUser } from "../reducer";
import { RootState } from "../../store";
import { Button, FormControl } from "react-bootstrap";
import { redirect, useRouter } from "next/navigation";
import type { User } from "../../Database";
import * as client from "../client";

export default function Profile() {
 const router = useRouter();
 const { currentUser } = useSelector((state: RootState) => state.accountReducer);
 const updateProfile = async () => {
  const updatedProfile = await client.updateUser(profile);
  dispatch(setCurrentUser(updatedProfile));
 };

const [profile, setProfile] = useState<User>(currentUser || {
    _id: "",
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
    dob: "",
    role: "USER",
    loginId: "",
    section: "",
    lastActivity: "",
    totalActivity: ""
  });;
 const dispatch = useDispatch();

 const signout = async() => {
   await client.signout();
   dispatch(setCurrentUser(null));
   redirect("/Account/Signin");
 };

  useEffect(() => {
    if (currentUser) {
      setProfile(currentUser);
    }
  }, [currentUser]);
 return (
   <div className="wd-profile-screen">
     <h3>Profile</h3>
     {profile && (
       <div>
         <FormControl id="wd-username" className="mb-2"
           value={profile.username}
           onChange={(e) => setProfile({ ...profile, username: e.target.value }) } />
         <FormControl id="wd-password" className="mb-2"
           value={profile.password}
           onChange={(e) => setProfile({ ...profile, password: e.target.value }) } />
         <FormControl id="wd-firstname" className="mb-2"
           value={profile.firstName}
           onChange={(e) => setProfile({ ...profile, firstName: e.target.value }) } />
         <FormControl id="wd-lastname" className="mb-2"
           value={profile.lastName}
           onChange={(e) => setProfile({ ...profile, lastName: e.target.value }) } />
         <FormControl id="wd-dob" className="mb-2" type="date"
           value={profile.dob}
           onChange={(e) => setProfile({ ...profile, dob: e.target.value })} />
         <FormControl id="wd-email" className="mb-2"
           value={profile.email}
           onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
         <select className="form-control mb-2" id="wd-role" 
            value={profile.role}
           onChange={(e) => setProfile({ ...profile, role: e.target.value })} >
           <option value="USER">User</option>
           <option value="ADMIN">Admin</option>
           <option value="FACULTY">Faculty</option>{" "}
           <option value="STUDENT">Student</option>
         </select>
         <button onClick={updateProfile} className="btn btn-primary w-100 mb-2"> Update</button>
         <Button onClick={signout} className="w-100 mb-2" id="wd-signout-btn">
           Sign out
         </Button>
         <Button onClick={() =>
          dispatch(
            setCurrentUser(profile)
          )
         }>Save</Button>
       </div>
     )}
   </div>
);}
