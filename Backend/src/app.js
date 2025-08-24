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
    origin: ["http://localhost:5173","http://192.168.141.63:5173","https://edusync-v1.netlify.app"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.use((err, req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://edusync-v1.netlify.app");
  res.header("Access-Control-Allow-Credentials", "true");
  res.status(err.status || 500).json({ message: err.message });
});

export { app };
