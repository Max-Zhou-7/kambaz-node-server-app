import { model } from "mongoose";
import {v4 as uuidv4} from "uuid";

export default function EnrollmentsDao(db) {
    function enrollUserInCourse(userId, courseId) {
        return model.create({
            user:userId,
            course: courseId,
            _id: `${userId}-${courseId}`,
        });
    }
    //     const { enrollments } = db;
    //     enrollments.push({ _id: uuidv4(), user: userId, course: courseId});
    // }

    function unenrollUserFromCourse(user, course) {
        return model.deleteOne({user, course});
    }

    async function findEnrollmentsForUser(userId) {
        const enrollments = await model.find({ user: userId}).populate("course");
        return enrollments.map((enrollment) => enrollment.course);
    }

    async function findEnrollmentsForCourse(courseId) {
        const enrollments = await model.find({course: courseId}).populate("user");
        return enrollments.map((enrollment) => enrollment.user);
    }

    function unenrollAllUsersFromCourse(courseId) {
        return model.deleteMany({course: courseId});
    }

    return { enrollUserInCourse,
            unenrollUserFromCourse,
            findEnrollmentsForCourse,
            findEnrollmentsForUser,
            unenrollAllUsersFromCourse,
    };
}