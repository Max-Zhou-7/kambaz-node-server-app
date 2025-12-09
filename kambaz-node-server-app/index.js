import express from 'express'
import mongoose from "mongoose";

import Hello from './Hello.js'
import Lab5 from '../kambaz-next-js/app/Labs/Lab5/index.js'
import cors from "cors";
// import db from "../kambaz-next-js/app/Kambaz/Database/index.js";
import UserRoutes from './Kambaz/Users/routes.js';
import CourseRoutes from './Kambaz/Courses/routes.js';
import ModulesRoutes from './Kambaz/Modules/routes.js'
import AssignmentsRoutes from './Kambaz/Assignments/routes.js';
import session from 'express-session';
import EnrollmentsRoutes from './Kambaz/Enrollments/routes.js';
import QuizzesRoutes from './Kambaz/Quizzes/routes.js';
import QuestionsRoutes from './Kambaz/Questions/routes.js';
import QuizAttemptsRoutes from './Kambaz/QuizAttempts/routes.js';

const CONNECTION_STRING = process.env.DATABASE_CONNECTION_STRING 
||"mongodb+srv://ziluzhou7_db_user:kambaz@kambaz.dys1nfo.mongodb.net/kambaz?retryWrites=true&w=majority";



await mongoose.connect(CONNECTION_STRING, {
    serverSelectionTimeoutMS: 15000,
    socketTimeoutMS: 60000,
});






const app = express();

app.use(cors({

    credentials:true,
    // origin: process.env.CLIENT_URL || ["http://localhost:3000", 
    // "https://kambaz-node-server-8na5e0c7b-max-zhou-7s-projects.vercel.app/"]
    origin: [
        'http://localhost:3000',
        /^https:\/\/kambaz-node-server-.*\.vercel\.app$/  // Allow all your Vercel deployments
    ]


}));

app.use(express.json());

const sessionOptions = {
    secret: process.env.SESSION_SECRET || "kambaz",
    resave: false,
    saveUninitialized: false,
   cookie: {
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
    }
};

// if (process.env.SERVER_ENV !== "development") {
//     sessionOptions.proxy = true;
//     sessionOptions.cookie = {
//         sameSite: "none",
//         secure: true,
//         domain: process.env.SERVER_URL,
//     };
// }

if (process.env.NODE_ENV === "production") {
    sessionOptions.proxy = true;
}

app.use(session(sessionOptions));



CourseRoutes(app);
UserRoutes(app);

ModulesRoutes(app);
AssignmentsRoutes(app);
EnrollmentsRoutes(app);
QuizzesRoutes(app);
QuestionsRoutes(app);
QuizAttemptsRoutes(app);


Hello(app)
Lab5(app)


app.get('/', (req, res) => {
    res.json({ 
        message: "Kambaz API Server is running", 
        status: "healthy",
        endpoints: {
            users: "/api/users",
            courses: "/api/courses",
            quizzes: "/api/quizzes",
            assignments: "/api/assignments",
            questions: "/api/questions"
        }
    });
});


app.listen(process.env.PORT || 4000)

