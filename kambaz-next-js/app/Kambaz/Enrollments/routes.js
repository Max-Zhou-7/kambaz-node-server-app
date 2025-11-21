import EnrollmentsDao  from "./dao.js";

export default function EnrollmentsRoutes(app, db) {
    const dao = EnrollmentsDao(db);

    const enrollUserInCourse = (req, res) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            res.sendStatus(401);
            return;
        }

        const { courseId } = req.params;
        const enrollment = dao.enrollUserInCourse(currentUser._id, courseId);
        res.json(enrollment);
    };


    const unenrollUserFromCourse = (req, res) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            res.sendStatus(401);
            return;
        }
        const { courseId } = req.params;
        dao.unenrollUserFromCourse(currentUser._id, courseId);
        res.sendStatus(204);
    };


    
    const findEnrollmentsForUser = (req, res) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            res.sendStatus(401);
            return;
        }
        const enrollments = dao.findEnrollmentsForUser(currentUser._id);
        res.json(enrollments);
    };

    app.post("/api/enrollments/:courseId", enrollUserInCourse);
    app.delete("/api/enrollments/:courseId", unenrollUserFromCourse);
    app.get("/api/enrollments", findEnrollmentsForUser);

}