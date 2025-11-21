
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { modules } from "../../../Database";
import { v4 as uuidv4 } from "uuid";
import type { Module } from "../../../Database";
const initialState = {
  modules:[],
};
 
const modulesSlice = createSlice({
  name: "modules",
  initialState,
  reducers: {
    setModules: (state, action) => {
      state.modules = action.payload;
    },


    addModule: (state: any, { payload: module }: PayloadAction<{name : string;
      course: string}>) => {
      const newModule: Module = {
        _id: uuidv4(),
        lessons: [],
        name: module.name,
        description: "",  
        course: module.course,
      };
      state.modules = [...state.modules, newModule];
    },
    deleteModule: (state: any, { payload: moduleId }: PayloadAction<string>) => {
      state.modules = state.modules.filter((m: any) => m._id !== moduleId);
    },
    updateModule: (state: any, { payload: module }: PayloadAction<Module>) => {
      state.modules = state.modules.map((m: any) =>
        m._id === module._id ? module : m
      );
    },
    editModule: (state: any, { payload: moduleId }: PayloadAction<string>) => {
      state.modules = state.modules.map((m: any) =>
        m._id === moduleId ? { ...m, editing: true } : m
      );
    },
  },
});
 
export const { addModule, deleteModule, updateModule, editModule, setModules } =
  modulesSlice.actions;
export default modulesSlice.reducer;