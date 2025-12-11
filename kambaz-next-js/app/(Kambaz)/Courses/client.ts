import axios from "axios";
const axiosWithCredentials = axios.create({ withCredentials: true});
const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
const USERS_API = `${HTTP_SERVER}/api/users`;
const MODULES_API = `${HTTP_SERVER}/api/modules`;
const ASSIGNMENTS_API = `${HTTP_SERVER}/api/assignments`;
const ENROLLMENTS_API = `${HTTP_SERVER}/api/enrollments`;


const COURSES_API = `${HTTP_SERVER}/api/courses`;
export const fetchAllCourses = async () => {
    const {data} = await axios.get(COURSES_API);
    return data;
};

export const findMyCourses = async () => {
    const {data} = await axiosWithCredentials.get(`${USERS_API}/current/courses?t=${Date.now()}`);
    return data;
}

export const createCourse = async (course: any) => {
    const { data } = await axiosWithCredentials.post(`${USERS_API}/current/courses`, course);
    return data;
};

export const deleteCourse = async (id: string) => {
    const { data } = await axiosWithCredentials.delete(`${COURSES_API}/${id}`);
    return data;
}

export const updateCourse = async (course: any) => {
    const { data } = await axiosWithCredentials.put(`${COURSES_API}/${course._id}`, course);
    return data;
}

export const findModulesForCourse = async (courseId: string) => {
    const response = await axios.get(`${COURSES_API}/${courseId}/modules`);
    return response.data;
}

export const createModuleForCourse = async (courseId: string, module: any) => {
    const response = await axios.post(
        `${COURSES_API}/${courseId}/modules`,
        module
    );
    return response.data;
}

export const deleteModule = async (coudseId: string, moduleId: string) => {
    const response = await axios.delete(`${COURSES_API}/${coudseId}/modules/${moduleId}`);
    return response.data
}

export const updateModule = async (courseId: string, module: any) => {
    const {data} = await axios.put(`${COURSES_API}/${courseId}/modules/${module._id}`, module);
    return data; 
}

export const findAssignmentsForCourse = async (courseId: string) => {
    const response = await axios.get(`${COURSES_API}/${courseId}/assignments`);
    return response.data;
};

export const createAssignmentForCourse = async (courseId: string, assignment:any) => {
    const response = await axios.post(`${COURSES_API}/${courseId}/assignments`, assignment);
    return response.data;
};

export const deleteAssignment = async (assignmentId: string) => {
    const response = await axios.delete(`${ASSIGNMENTS_API}/${assignmentId}`);
    return response.data;
};

export const updateAssignment = async (assignment: any) => {
    const {data} = await axios.put(`${ASSIGNMENTS_API}/${assignment._id}`, assignment);
    return data;
};


export const enrollInCourse = async (courseId: string) => {
    const response = await axiosWithCredentials.post(`${ENROLLMENTS_API}/${courseId}`);
    return response.data;
}

export const unenrollFromCourse = async (courseId: string) => {
    const response = await axiosWithCredentials.delete(`${ENROLLMENTS_API}/${courseId}`);
    return response.data;
}

export const getMyEnrollments = async () => {
    const response = await axiosWithCredentials.get(`${ENROLLMENTS_API}`);
    return response.data;
}


export const findUsersForCourse = async (courseId: string) => {
    const response = await axios.get(`${COURSES_API}/${courseId}/users`);
    return response.data;
};