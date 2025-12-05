import { createSlice } from "@reduxjs/toolkit";
// import { v4 as uuidv4 } from "uuid";

const initialState = {
  assignments: [],
};

const assignmentsSlice = createSlice({
  name: "assignments",
    initialState,
    reducers: {

    setAssignment: (state, action) => {
      state.assignments = action.payload;
    },

    addAssignment: (state, { payload: assignment }) => {
      // const newAssignment: any = {
      //   _id: uuidv4(), 
      //   title: assignment.title,
      //   course: assignment.course,
      //   availableFrom: assignment.availableFrom,
      //   dueDate: assignment.dueDate,
      //   points: assignment.points,
      //   description: assignment.description,
      //   availableUntil: assignment.availableUntil,
      //   };
        state.assignments = [...state.assignments, assignment] as any;
    },
    deleteAssignment: (state, { payload: assignmentId }) => {
      state.assignments = state.assignments.filter(
        (a: any) => a._id !== assignmentId
      );
    },
    updateAssignment: (state, { payload: assignment }) => {
      state.assignments = state.assignments.map((a: any) =>
        a._id === assignment._id  ? {...a, ...assignment }  
          : a
      ) as any;
    },
    editAssignment: (state, { payload: assignmentId }) => {
      state.assignments = state.assignments.map((a: any) =>
        a._id === assignmentId ? { ...a, editing: true } : 
      { ...a, editing: false }
      ) as any;
    },
  },
});
export const { addAssignment, deleteAssignment, updateAssignment, editAssignment, setAssignment } =
  assignmentsSlice.actions;
export default assignmentsSlice.reducer;