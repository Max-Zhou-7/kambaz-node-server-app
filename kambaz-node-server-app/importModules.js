import mongoose from "mongoose";
import AssignmentModel from "./Kambaz/Assignments/model.js";
import assignmentsData from "./Kambaz/Database/assignments.js";

const CONNECTION_STRING = "mongodb+srv://ziluzhou7_db_user:kambaz@kambaz.dys1nfo.mongodb.net/kambaz";

await mongoose.connect(CONNECTION_STRING);
console.log("✅ Connected to MongoDB");

// Delete all existing assignments first
await AssignmentModel.deleteMany({});
console.log("🗑️  Deleted all existing assignments");

for (const assignment of assignmentsData) {
    await AssignmentModel.create(assignment);
    console.log(`✅ Created assignment: ${assignment._id}`);
}

console.log("🎉 Done! Imported", assignmentsData.length, "assignments");
await mongoose.disconnect();