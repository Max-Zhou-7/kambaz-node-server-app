import express from 'express'
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
const app = express()

app.use(cors({

    credentials:true,
    origin: process.env.CLIENT_URL || "http://localhost:3000",


}));

app.use(express.json());

const sessionOptions = {
    secret: process.env.SESSION_SECRET || "kambaz",
    resave: false,
    saveUninitialized: false,
   cookie: {
        sameSite: "lax",
        secure: false,
        httpOnly: true,
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


app.use(session(sessionOptions));




UserRoutes(app, db);
CourseRoutes(app, db);
ModulesRoutes(app, db);
AssignmentsRoutes(app, db);
EnrollmentsRoutes(app, db);


Hello(app)
Lab5(app)

app.listen(process.env.PORT || 4000)

