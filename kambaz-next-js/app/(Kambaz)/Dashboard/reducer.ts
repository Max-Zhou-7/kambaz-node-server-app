import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import * as db from "../Database";
import type { Enrollment } from "../Database";

interface EnrollmentState {
  enrollments: Enrollment[];
  showAllCourses: boolean;
}

const initialState: EnrollmentState = {
  enrollments: db.enrollments,
  showAllCourses: false,
};

const enrollmentsSlice = createSlice({
  name: "enrollments",
  initialState,
  reducers: {
    setEnrollments: (state, action: PayloadAction<Enrollment[]>) => {
      state.enrollments = action.payload;
    },
    enrollCourse: (state, action: PayloadAction<Enrollment>) => {
      const exists = state.enrollments.find(
        (e) => e.user === action.payload.user && e.course === action.payload.course
      );
      if (!exists) {
        state.enrollments.push(action.payload);
      }
    },
    unenrollCourse: (state, action: PayloadAction<string>) => {
      state.enrollments = state.enrollments.filter(
        (e) => e._id !== action.payload
      );
    },
    toggleShowAllCourses: (state) => {
      state.showAllCourses = !state.showAllCourses;
    },
  },
});

export const { setEnrollments, enrollCourse, unenrollCourse, toggleShowAllCourses } =
  enrollmentsSlice.actions;
export default enrollmentsSlice.reducer;