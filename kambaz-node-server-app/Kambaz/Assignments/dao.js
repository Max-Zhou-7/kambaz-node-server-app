import model from "./model.js";

export const findAssignmentsForCourse = (courseId) => {
    return model.find({ course: courseId });
};

export const createAssignment = (assignment) => {
   if (!assignment._id) {
        assignment._id = new Date().getTime().toString();
   }
    return model.create(assignment);
};

export const deleteAssignment = (assignmentId) => {
    return model.deleteOne({ _id: assignmentId });
};

export const updateAssignment = (assignmentId, assignmentUpdates) => {
    return model.updateOne({ _id: assignmentId }, { $set: assignmentUpdates });
};


export const findAssignmentById = (assignmentId) => {
    return model.findById(assignmentId);
};