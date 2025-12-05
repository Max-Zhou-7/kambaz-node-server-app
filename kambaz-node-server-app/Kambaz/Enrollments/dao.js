import  model  from "./model.js";
// import {v4 as uuidv4} from "uuid";

    export const enrollUserInCourse=async (userId, courseId) => {
            const existing = await model.findOne({ user: userId, course: courseId });
    if (existing) return existing;
    
        return model.create({
            user:userId,
            course: courseId,
            _id: `${userId}-${courseId}`,
        });
    }
    //     const { enrollments } = db;
    //     enrollments.push({ _id: uuidv4(), user: userId, course: courseId});
    // }

   export const unenrollUserFromCourse = (user, course) => {
        return model.deleteOne({user, course});
    }

    export const findEnrollmentsForUser = async (userId) => {
        return await model.find({ user: userId});
        
    }

    export const findEnrollmentsForCourse= async (courseId) => {
        const enrollments = await model.find({course: courseId}).populate("user");
        return enrollments.map((enrollment) => enrollment.user);
    }

    export const unenrollAllUsersFromCourse = (courseId) => {
        return model.deleteMany({course: courseId});
    }


    export const findCoursesForUser = async (userId) => {
    const enrollments = await model.find({ user: userId }).populate("course");
    return enrollments.map((enrollment) => enrollment.course);
};
    // return { enrollUserInCourse,
    //         unenrollUserFromCourse,
    //         findEnrollmentsForCourse,
    //         findEnrollmentsForUser,
    //         unenrollAllUsersFromCourse,
    // };