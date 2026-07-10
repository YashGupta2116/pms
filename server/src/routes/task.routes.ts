import { Router } from "express";
import {
  createTask,
  getTasks,
  getUserTasks,
  updateTaskStatus,
  createComment,
  createAttachment,
} from "../controllers/task.controller.js";

const router = Router();

router.get("/", getTasks);
router.post("/", createTask);
router.patch("/:taskId/status", updateTaskStatus);
router.get("/user/:userId", getUserTasks);
router.post("/:taskId/comments", createComment);
router.post("/:taskId/attachments", createAttachment);

export default router;
