import model from "./model.js";
// import {v4 as uuidv4 }  from "uuid";
import enrollmentModel from "../Enrollments/model.js";

// export default function CoursesDao() {
    export const findAllCourses=() => {
        // return model.find({}, {name:1, description: 1});
        return model.find();
 
    };
    export const findCoursesForEnrolledUser = async (userId) => {
 const enrollments = await enrollmentModel.find({ user: userId }).populate("course");
 return enrollments.map((enrollment) => enrollment.course);
    }


    export const createCourse= (course) => {
        delete course._id;
        return model.create(course);
    }

    export const deleteCourse = async (courseId) => {
        // const { enrollments } =db;
        // db.courses = courses.filter((course) => course._id !== courseId);
        // db.enrollments = enrollments.filter(
        //     (enrollment) => enrollment.course !== courseId
        // );
        await enrollmentModel.deleteMany({ course: courseId });
        return model.deleteOne({_id: courseId});
    }
    export const updateCourse = (courseId, courseUpdates) => {
        return model.updateOne({_id: courseId}, { $set: courseUpdates});
        // const { courses } =db;
        // const course = courses.find((course) => course._id === courseId);
        // Object.assign(course, courseUpdates);
        // return course;
    }


    // return { findAllCourses,
    //     findCoursesForEnrolledUser,
    //     createCourse,
    //     deleteCourse,
    //     updateCourse,
    // };
// } 

