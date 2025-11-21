import courses from "./courses.json";
import modules from "./modules.json";
import assignments from "./assignments.json";
import users from "./users.json";
import enrollments from "./enrollments.json";


export interface User {
    _id: string;
    username: string;
    password: string;
    role: string;
    dob: string;
    section: string;
    lastActivity: string;
    totalActivity: string;
    email: string;
    firstName: string;
    lastName: string;
    loginId: string;
}
export interface Course {
    _id: string;
    name: string;
    number: string;
    startDate: string;
    endDate: string;
    department?: string;
    credits?: number;
    description: string;
    image?: string;
}

export interface Module {
    _id: string;
    name: string;   
    description: string;
    course: string;
    lessons?: Lesson[];
    editing?: boolean;
}
export interface Lesson {
    _id: string;
    name: string;
    description: string;
    module: string;
}

export interface Assignment {
    _id: string;
    title: string;
    course: string;
    availableFrom: string;
    dueDate: string;
    points: number;
    untilDate?: string;
    description?: string;
    submissions?: Submission[];
    displayGradeAs?: string;
    assignmentGroup?: string;
    editing?: boolean;
}
export interface Submission {
    _id: string;
    assignment: string;
}
export interface Enrollment {
    _id: string;
    user: string;
    course: string;
}

export {  courses , modules, assignments  ,users, enrollments};