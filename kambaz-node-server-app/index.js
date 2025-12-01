import express from 'express'
import mongoose from "mongoose";

import Hello from './Hello.js'
import Lab5 from '../kambaz-next-js/app/Labs/Lab5/index.js'
import cors from "cors";
import db from "../kambaz-next-js/app/Kambaz/Database/index.js";
import UserRoutes from '../kambaz-next-js/app/Kambaz/Users/routes.js';
import CourseRoutes from '../kambaz-next-js/app/Kambaz/Courses/routes.js';
import ModulesRoutes from '../kambaz-next-js/app/Kambaz/Modules/routes.js'
import AssignmentsRoutes from '../kambaz-next-js/app/Kambaz/Assignments/routes.js';
import session from 'express-session';
import EnrollmentsRoutes from '../kambaz-next-js/app/Kambaz/Enrollments/routes.js';


const CONNECTION_STRING = process.env.DATABASE_CONNECTION_STRING || "mongodb://127.0.0.1:27017/kambaz"
mongoose.connect(CONNECTION_STRING);

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




UserRoutes(app, db);
CourseRoutes(app, db);
ModulesRoutes(app, db);
AssignmentsRoutes(app, db);
EnrollmentsRoutes(app, db);


Hello(app)
Lab5(app)

app.listen(process.env.PORT || 4000)

