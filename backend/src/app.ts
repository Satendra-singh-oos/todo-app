import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "20kb" }));

app.use(cookieParser());

// imported routes
import userRoute from "./routes/user.routes";
import todoRoute from "./routes/todo.routes";

// routes declartion

app.use("/api/v1/users", userRoute);
app.use("/api/v1/todos", todoRoute);

export { app };
