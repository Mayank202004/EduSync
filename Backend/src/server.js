import connectDatabase from "./config/database.js";
import { app } from "./app.js";
import { seedDefaultFeeStructures } from "./seed/feeStructure.seed.js";

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
await seedDefaultFeeStructures();

// Routes Imports
import userRouter from "./routes/user.routes.js";
import resourceRouter from "./routes/resource.routes.js";
import studentRouter from "./routes/student.routes.js";
import teacherRouter from "./routes/teacher.routes.js";
import attendenceRouter from "./routes/attendence.routes.js";
import feeStructureRouter from "./routes/feeStructure.routes.js";
import paidFeeRouter from "./routes/paidFees.routes.js";


// Routes Declarations
app.use("/api/v1/users", userRouter);
app.use("/api/v1/resource", resourceRouter);
app.use("/api/v1/student",studentRouter);
app.use("/api/v1/teacher",teacherRouter);
app.use("/api/v1/attendence",attendenceRouter);
app.use("/api/v1/feestructure",feeStructureRouter);
app.use("/api/v1/fee",paidFeeRouter);

// Global Error Handler
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
    });
});

