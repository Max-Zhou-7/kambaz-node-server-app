
import * as dao from "./dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js";


export default function CourseRoutes(app) {
    // const dao = CoursesDao();
    // const enrollmentsDao = EnrollmentsDao();
    const findAllCourses = async (req, res) => {
        const courses = await dao.findAllCourses();
        res.send(courses);
    }
    const findCoursesForUser = async (req, res) => {
        let {userId} = req.params;
        if ( userId === "current") {
            const currentUser = req.session["currentUser"];
            if (!currentUser) {
                res.sendStatus(401);
                return;
            }
            userId = currentUser._id;
        if (currentUser.role === "FACULTY") {
            const courses = await dao.findAllCourses();
            res.json(courses);
            return;
        }
        }
        // const courses = await dao.findCoursesForEnrolledUser(userId);
        const courses = await enrollmentsDao.findCoursesForUser(userId);
        res.json(courses);
    }

    const createCourse = async (req, res) => {
        // const currentUser = req.session["currentUser"];
        const newCourse = await dao.createCourse(req.body);
        // enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);
        res.json(newCourse);
    };

    const deleteCourse = async (req, res) => {
        const { courseId } = req.params;
        await EnrollmentsDao.unenrollAllUsersFromCourse(courseId);
        const status = await dao.deleteCourse(courseId);
        res.send(status);
    }

    const updateCourse = async (req, res) => {
        const { courseId } = req.params;
        const courseUpdates = req.body;
        const status = await dao.updateCourse(courseId, courseUpdates);
        res.send(status);
    }

    app.put("/api/courses/:courseId", updateCourse);
    app.delete("/api/courses/:courseId", deleteCourse);
    app.post("/api/users/current/courses", createCourse);
    app.get("/api/users/:userId/courses", findCoursesForUser);
    app.get("/api/courses", findAllCourses);
}