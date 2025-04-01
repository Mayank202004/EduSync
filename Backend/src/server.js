import connectDatabase from "./config/database.js";
import { app } from "./app.js";


connectDatabase()
    .then(() => {
        app.listen(process.env.PORT || 3000, () => {
            console.log(`Server is running at port : ${process.env.PORT}`);
        });
    })
    .catch((error) => {
        console.error("MongoDB connection failed");
        console.error(`Details : ${error}`);
        process.exit(1);
    });

// Routes Imports
import userRouter from "./routes/user.routes.js";
import resourceRouter from "./routes/resource.routes.js";
import studentRouter from "./routes/student.routes.js";
import teacherRouter from "./routes/teacher.routes.js";


// Routes Declarations
app.use("/api/v1/users", userRouter);
app.use("/api/v1/resource", resourceRouter);
app.use("/api/v1/student",studentRouter);
app.use("/api/v1/teacher",teacherRouter);

