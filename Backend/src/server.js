import connectDatabase from "./config/database.js";
import { app } from "./app.js";
import { seedDefaultFeeStructures } from "./seed/feeStructure.seed.js";
import { Server } from "socket.io";
import http from "http";
import { setupSocket } from "./sockets/setupSocket.js";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import { User } from "./models/user.model.js";

// Create HTTP server
const server = http.createServer(app);

// Setup socket.io server
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173","http://192.168.141.63:5173"],
    credentials: true,
  },
});
io.use(async(socket, next) => {
  try {
    const cookies = cookie.parse(socket.handshake.headers.cookie || "");
    let token = cookies.accessToken;

    // Try fallback token from auth
    if (!token && socket.handshake.auth?.token) {
      token = socket.handshake.auth.token;
    }

    if (!token) {
      return next(new Error("Token missing"));
    }
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded._id).select("-password");
    
    if (!user) return next(new Error("User not found"));
    user.className = socket.handshake.query.className || null;
    socket.user = user;
    next();
  } catch (err) {
    return next(new Error("Invalid token"));
  }
});

setupSocket(io); // Initialize socket events 

connectDatabase()
  .then(() => {
    server.listen(process.env.PORT || 3000, () => {
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
import calendarRouter from "./routes/calendar.routes.js";
import classRouter from "./routes/classStructure.routes.js"
import dashboardRouter from "./routes/dashboard.routes.js"
import chatRouter from "./routes/chat.routes.js"
import faqRouter from "./routes/faq.routes.js"
import ticketRouter from "./routes/ticket.routes.js"
import settingRouter from "./routes/setting.routes.js"
import schoolRouter from "./routes/school.routes.js"

// Routes Declarations
app.use("/api/v1/users", userRouter);
app.use("/api/v1/resource", resourceRouter);
app.use("/api/v1/student",studentRouter);
app.use("/api/v1/teacher",teacherRouter);
app.use("/api/v1/attendence",attendenceRouter);
app.use("/api/v1/feestructure",feeStructureRouter);
app.use("/api/v1/fee",paidFeeRouter);
app.use("/api/v1/calendar",calendarRouter);
app.use("/api/v1/class",classRouter);
app.use("/api/v1/dashboard",dashboardRouter);
app.use("/api/v1/chat",chatRouter);
app.use("/api/v1/faq",faqRouter);
app.use("/api/v1/ticket",ticketRouter);
app.use("/api/v1/setting",settingRouter);
app.use("/api/v1/school",schoolRouter);

// Global Error Handler
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
    });
});

