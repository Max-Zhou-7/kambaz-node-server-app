import ModulesDao from "../Modules/dao.js";
export default function ModulesRoutes(app, db) {
    const dao = ModulesDao(db);
    const findModulesForCourse = (req, res) => {
        const { courseId } = req.params;
        const modules = dao.findModulesForCourse(courseId);
        res.json(modules);
    }

    const createModuleForCourse = (req, res) => {
        const { courseId } = req.params;
        const newModule = {
            ...req.body,
            course: courseId,
        };
        const createModule = dao.createModule(newModule);
        res.send(createModule);
    }

    const deleteModule = (req, res) => {
        const { moduleId } = req.params;
        const status = dao.deleteModule(moduleId);
        res.send(status);
    }
    
    const updateModule = async (req, res) => {
        const { moduleId } = req.params;
        const moduleUpdates = req.body;
        const status = await dao.updateModule(moduleId, moduleUpdates);
        res.send(status);
    }

    app.put("/api/modules/:moduleId", updateModule);
    app.delete("/api/modules/:moduleId", deleteModule);
    app.post("/api/courses/:courseId/modules", createModuleForCourse)
    app.get("/api/courses/:courseId/modules", findModulesForCourse);
}

