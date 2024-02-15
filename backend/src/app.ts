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

// routes declartion

app.use("/api/v1/users", userRoute);

export { app };
