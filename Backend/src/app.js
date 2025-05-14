import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import { configDotenv } from "dotenv";

const app = express();

configDotenv({
    path: "./.env",
});

//cross origin resourse sharing
app.use(
  cors({
    origin: "http://localhost:5173", // or your deployed frontend URL
    credentials: true,
  })
);


app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

export { app };
