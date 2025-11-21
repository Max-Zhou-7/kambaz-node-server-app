import { v4 as uuidv4 } from "uuid";

export default function ModulesDao(db) {
    function findModulesForCourse(courseId) {

        return db.modules.filter( (mod) => mod.course === courseId); 
    }


    function createModule(module) {
        const newModule = { ...module, _id: uuidv4() };
        db.modules = [...db.modules, newModule];
        return newModule
    }


    function deleteModule(moduleId) {
        const { modules } = db;
        db.modules = modules.filter((mod) => mod._id !== moduleId);
    }

    function updateModule(moduleId, moduleUpdates) {;
        const moduleToUpdate = db.modules.find((mod) => mod._id === moduleId);
        if (moduleToUpdate) {
        Object.assign(moduleToUpdate, moduleUpdates);
        return moduleToUpdate;
        }
    }

    return {
        findModulesForCourse,
        createModule,
        deleteModule,
        updateModule,
    }


}

