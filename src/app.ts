import express from "express";
import cors from "cors";

import { router } from "./routes";

import userRouter from "./routes/user.router";
import authRouter from "./routes/auth.router";
import categoryRouter from "./routes/category.router";
import transactionRouter from "./routes/transection.router";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", authRouter);
app.use("/api", userRouter);
app.use("/api", categoryRouter);
app.use("/api", transactionRouter);
app.use("/api", router);


export { app };