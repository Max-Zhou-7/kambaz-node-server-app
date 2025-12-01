import { v4 as uuidv4 } from "uuid";
import model from "../Courses/model.js";
export default function ModulesDao(db) {
    async function findModulesForCourse(courseId) {
        const course = await model.findById(courseId);
        return course.modules;
    }


    async function createModule(courseId, module) {
        const newModule = { ...module, _id: uuidv4() };
        const status = await model.updateOne(
            {_id: courseId},
            {$push: { modules:newModule}}
        );
        return newModule
    }


    async function deleteModule(courseId, moduleId) {
           const status = await model.updateOne(
     { _id: courseId },
     { $pull: { modules: { _id: moduleId } } }
   );
   return status;
        // const { modules } = db;
        // db.modules = modules.filter((mod) => mod._id !== moduleId);
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

