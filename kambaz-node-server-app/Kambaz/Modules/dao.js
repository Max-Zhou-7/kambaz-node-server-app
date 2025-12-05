// import { v4 as uuidv4 } from "uuid";
import model from "../Courses/model.js";
import mongoose from "mongoose"

    export async function findModulesForCourse(courseId) {
        const course = await model.findById(courseId);
        return course.modules;
    }


    export async function createModule(courseId, module) {
        const newModule = { ...module, _id: new mongoose.Types.ObjectId().toString() };
        const status = await model.updateOne(
            {_id: courseId},
            {$push: { modules:newModule}}
        );
        return newModule
    }


    export async function deleteModule(courseId, moduleId) {
           const status = await model.updateOne(
     { _id: courseId },
     { $pull: { modules: { _id: moduleId } } }
   );
   return status;
        // const { modules } = db;
        // db.modules = modules.filter((mod) => mod._id !== moduleId);
    }

   export async function updateModule(courseId, moduleId, moduleUpdates) {
        // const moduleToUpdate = db.modules.find((mod) => mod._id === moduleId);
        const course = await model.findById(courseId);
        const moduleToUpdate = course.modules.id(moduleId);
        Object.assign(moduleToUpdate, moduleUpdates);
        await course.save();
        return moduleToUpdate
        }
    

    // return {
    //     findModulesForCourse,
    //     createModule,
    //     deleteModule,
    //     updateModule,
    // }




