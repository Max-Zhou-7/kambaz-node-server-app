import * as enrollmentsDao  from "./dao.js";

export default function EnrollmentsRoutes(app) {

    const enrollUserInCourse = async (req, res) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            res.sendStatus(401);
            return;
        }

        const { courseId } = req.params;
        const enrollment = await enrollmentsDao.enrollUserInCourse(currentUser._id, courseId);
        
        res.json(enrollment);
    };


    const unenrollUserFromCourse = async (req, res) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            res.sendStatus(401);
            return;
        }
        const { courseId } = req.params;
        await enrollmentsDao.unenrollUserFromCourse(currentUser._id, courseId);
        res.sendStatus(204);
    };


    
    const findEnrollmentsForUser = async (req, res) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            res.sendStatus(401);
            return;
        }
        const enrollments = await enrollmentsDao.findEnrollmentsForUser(currentUser._id);
        res.json(enrollments);
    };

    const findUsersForCourse = async (req, res) => {
    const { courseId } = req.params;
    const users = await enrollmentsDao.findEnrollmentsForCourse(courseId);
    res.json(users);
};

    app.post("/api/enrollments/:courseId", enrollUserInCourse);
    app.delete("/api/enrollments/:courseId", unenrollUserFromCourse);
    app.get("/api/enrollments", findEnrollmentsForUser);
    app.get("/api/courses/:courseId/users", findUsersForCourse);

}