const assignment = {
    id: 1, title: "NodeJS Assignment",
    description: "Create a NodeJS server with ExpressJS",
    due: "2021-10-10", complted: false, score: 0,
};

const moduleData = {
        id:1, name:"NodeJS Module",
        description: "Create a NodeJS server with ExpressJS",
        course: "cs5610",
    };

export default function WorkingWithObjects(app) {
    const getAssignment = (req, res) => {
        res.json(assignment);
    };
    const getAssignmentTitle = (req, res) => {
        res.json(assignment.title);
    }
    const setAssignmentTitle = (req, res) => {
        const { newTitle } = req.params;
        assignment.title = newTitle;
        res.json(assignment);
    }
    const setAssignmentScore = (req, res) => {
        const {newScore} = req.params;
        assignment.score = newScore;
        res.json(assignment)
    }
    const setAssignmentComplete = (req, res) => {
        const { completeStatus} = req.params;
        assignment.complted = completeStatus;
        res.json(assignment)
    }
    const getModule = (req, res) => {
        res.json(moduleData);
    }
    const getModuleName = (req, res) => {
        res.json(moduleData.name)
    }
    const setModuleName = (req, res) => {
        const {newName} = req.params;
        moduleData.name = newName;
        res.json(moduleData)
    }
    const setModuleDescription = (req, res) => {
        const {newDescription} = req.params;
        moduleData.description = newDescription;
        res.json(moduleData)
    }
    
    app.get("/lab5/assignment/title/:newTitle", setAssignmentTitle);
    app.get("/lab5/assignment/completed/:completeStatus", setAssignmentComplete)
    app.get("/lab5/assignment/score/:newScore", setAssignmentScore)
    app.get("/lab5/assignment/title", getAssignmentTitle)
    app.get("/lab5/assignment", getAssignment);
    app.get("/lab5/module/name/:newName", setModuleName)
    app.get("/lab5/module/description/:newDescription", setModuleDescription)
    app.get("/lab5/module/name", getModuleName)
    app.get("/lab5/module", getModule)
    
    
}