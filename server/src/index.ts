import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";

// ROUTE IMPORTS
import projectRoutes from "./routes/project.routes.js";
import taskRoutes from "./routes/task.routes.js";
import searchRoutes from "./routes/search.routes.js";
import userRoutes from "./routes/user.routes.js";
import teamRoutes from "./routes/team.routes.js";
import authRoutes from "./routes/auth.routes.js";
import activityRoutes from "./routes/activity.routes.js";
import { authMiddleware } from "./middleware/auth.middleware.js";

// Configs
dotenv.config();

const app = express();
app.set("trust proxy", 1);
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Routes
app.get("/", (req, res) => {
  res.send("This is home route");
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(limiter);

app.use("/auth", authRoutes);
app.use("/projects", authMiddleware, projectRoutes);
app.use("/tasks", authMiddleware, taskRoutes);
app.use("/search", authMiddleware, searchRoutes);
app.use("/users", authMiddleware, userRoutes);
app.use("/teams", authMiddleware, teamRoutes);
app.use("/activities", authMiddleware, activityRoutes);

// Server

const port = Number(process.env.PORT) || 3000;
app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port: ${port}`);
});
