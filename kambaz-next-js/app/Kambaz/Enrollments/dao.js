import {v4 as uuidv4} from "uuid";

export default function EnrollmentsDao(db) {
    function enrollUserInCourse(userId, courseId) {
        const { enrollments } = db;
        enrollments.push({ _id: uuidv4(), user: userId, course: courseId});
    }

    function unenrollUserFromCourse(userId, courseId) {
        db.enrollments = db.enrollments.filter(
            (enrollments) => !(enrollments.user === userId, enrollments.course == courseId)
        );
    }

    function findEnrollmentsForUser(userId) {
        return db.enrollments.filter((enrollments) =>
        enrollments.user === userId );
    }

    function findEnrollmentsForCourse(courseId) {
        return db.enrollments.filter((enrollments) =>
        enrollments.course === courseId);
    }


    return { enrollUserInCourse,
            unenrollUserFromCourse,
            findEnrollmentsForCourse,
            findEnrollmentsForUser,
    };
}