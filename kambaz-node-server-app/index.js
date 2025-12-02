import express from 'express'
import mongoose from "mongoose";

import Hello from './Hello.js'
// import Lab5 from '../kambaz-next-js/app/Labs/Lab5/index.js'
import cors from "cors";
// import db from "../kambaz-next-js/app/Kambaz/Database/index.js";
import UserRoutes from '../kambaz-next-js/app/Kambaz/Users/routes.js';
import CourseRoutes from '../kambaz-next-js/app/Kambaz/Courses/routes.js';
import ModulesRoutes from '../kambaz-next-js/app/Kambaz/Modules/routes.js'
import AssignmentsRoutes from '../kambaz-next-js/app/Kambaz/Assignments/routes.js';
import session from 'express-session';
import EnrollmentsRoutes from '../kambaz-next-js/app/Kambaz/Enrollments/routes.js';


const CONNECTION_STRING = process.env.DATABASE_CONNECTION_STRING 
||"mongodb+srv://ziluzhou7_db_user:kambaz@kambaz.dys1nfo.mongodb.net/kambaz?retryWrites=true&w=majority";
console.log('🔌 Connecting to MongoDB...');
console.log('📍 FULL CONNECTION STRING:', CONNECTION_STRING);


await mongoose.connect(CONNECTION_STRING, {
    serverSelectionTimeoutMS: 15000,
    socketTimeoutMS: 60000,
});

console.log('✅ MongoDB connected successfully');
console.log('📊 Host:', mongoose.connection.host);
console.log('🗄️  Database:', mongoose.connection.name);

// Test model immediately after connection
console.log('🔍 Testing course model...');
const courseModel = (await import('../kambaz-next-js/app/Kambaz/Courses/model.js')).default;
console.log('📦 Model loaded:', courseModel.modelName);

console.log('⏳ Attempting countDocuments...');
const count = await courseModel.countDocuments();
console.log('✅ Count succeeded! Documents:', count);

console.log('⏳ Attempting find...');
const courses = await courseModel.find().limit(1);
console.log('✅ Find succeeded! Sample:', courses[0] || 'No courses found');




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




UserRoutes(app);
CourseRoutes(app);
ModulesRoutes(app);
AssignmentsRoutes(app);
EnrollmentsRoutes(app);


// Hello(app)
// Lab5(app)

app.listen(process.env.PORT || 4000)

