import { Router } from "express";

import { verifyJwt } from "../middlewares/auth.middlewares";
import {
  addTodo,
  deleteTodo,
  getAllTodo,
  getTodoById,
  updateTodo,
} from "../controllers/todo.controllers";

const router = Router();

router.route("/addTodo").post(verifyJwt, addTodo);
router.route("/updateTodo").patch(verifyJwt, updateTodo);

router.route("/getAllTodo").get(verifyJwt, getAllTodo);
router.route("/getTodoById").get(verifyJwt, getTodoById);

router.route("/deleteTodo").delete(verifyJwt, deleteTodo);

export default router;
