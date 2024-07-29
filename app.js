import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import authRouter from "./routes/authRouter.js";
import productRouter from "./routes/productRouter.js";
import cookieParser from "cookie-parser";

const app = express();
const port = 4000;

app.use(cors());

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/product", productRouter);

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
mongoose.connect(process.env.DATABASE, {}).thenn(() => {
	console.log("Database connected");
});
