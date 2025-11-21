"use client"
import Link from "next/link";
import { FormControl, Button } from "react-bootstrap";
import { redirect } from "next/navigation";
import { setCurrentUser } from "../reducer";
import { useDispatch } from "react-redux";
import { useState } from "react";
import * as client from "../client";


export default function Signup() {
  const [user, setUser] = useState<any>({username: "", password: ""});
  const[error, setError] = useState("")
  const dispatch = useDispatch();
  const signup = async() => {
    try {
    const currentUser = await client.signup(user);
    dispatch(setCurrentUser(currentUser));
    redirect("/Profile");
    } catch (err: any) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };
  return (
    <div id="wd-signup-screen">
      <h3>Sign up</h3>
    {error && <div className="alert alert-danger">{error}</div>}
      <FormControl value={user.username} onChange={(e)=>setUser({
        ...user, username: e.target.value})}
             placeholder="username"
             className="wd-username mb-2"/>
      <FormControl value={user.password} onChange={(e) => setUser({
        ...user, password:e.target.value
      })}
             placeholder="password" type="password"
             className="wd-password mb-2"/>
      <button  onClick={signup}
         className="wd-signup-btn btn btn-primary w-100 mb-2" >
         Sign up </button><br/>
      <Link id = "wd-signin-link" href="/Account/Signin" > Sign in </Link>
    </div>
);}
