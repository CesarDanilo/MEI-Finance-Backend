import express from "express";
import cors from "cors";

import { router } from "./routes";

import userRouter  from "./routes/user.router"

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", userRouter)
app.use("/api", router);


export { app };