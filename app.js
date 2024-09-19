// server.js (Express app)

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";

import authRouter from "./routes/authRouter.js";
import referenceRouter from "./routes/referenceRoute.js";
import taskRouter from "./routes/taskRouter.js";
import helmet from "helmet";
import mongosanitize from "express-mongo-sanitize";

import cookieParser from "cookie-parser";
dotenv.config();

const app = express();
const port = 4000;

app.use(
  cors({
    origin: "https://taskfe.vercel.app", // URL frontend
    credentials: true, // Mengizinkan pengiriman cookie
  })
);
app.use(helmet());
app.use(mongosanitize());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1/auth", authRouter);

app.use("/api/v1/reference", referenceRouter);
app.use("/api/v1/task", taskRouter);

app.use(notFound);
app.use(errorHandler);
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

mongoose.connect(process.env.DATABASE, {}).then(() => {
  console.log("Database connected");
});
