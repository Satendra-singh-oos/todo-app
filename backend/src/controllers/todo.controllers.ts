import { Request, Response, NextFunction } from "express";
import asyncHandler from "../utils/asyncHandler";
import { todoSchema } from "../validations/todo.validations";
import prisma from "../prisma";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";

const addTodo = asyncHandler(async (req: Request | any, res: Response) => {
  const userId = req.user?.id;

  const todoData = todoSchema.parse(req.body);

  const newTodo = await prisma.todo.create({
    data: {
      title: todoData.title,
      description: todoData.description,
      completed: todoData.completed,
      ownerId: userId,
    },
    select: {
      title: true,
      description: true,
      completed: true,
      id: true,
      owner: {
        where: {
          id: userId,
        },
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  res
    .status(200)
    .json(new ApiResponse(200, newTodo, "succesfully created Todo"));
});

const updateTodo = asyncHandler(async (req: Request | any, res: Response) => {
  const userId = req.user?.id;
  const { id } = req.query;
  if (!id) {
    throw new ApiError(404, "Id of todo required");
  }

  const todoData = todoSchema.parse(req.body);

  const todoId = Number(id);

  const findTodo = await prisma.todo.findFirst({
    where: {
      id: todoId,
    },
  });

  if (!findTodo) {
    throw new ApiError(404, "No Todo Found");
  }

  if (findTodo?.ownerId !== userId) {
    throw new ApiError(
      404,
      "You Are not authorized to update the todo as you are not the owner"
    );
  }

  const updateTodo = await prisma.todo.update({
    where: {
      id: todoId,
    },
    data: {
      title: todoData.title,
      description: todoData.description
        ? todoData.description
        : findTodo?.description,
      completed: todoData.completed,
    },
  });

  res
    .status(200)
    .json(new ApiResponse(200, updateTodo, "Succesfully updated the todo"));
});

const deleteTodo = asyncHandler(async (req: Request | any, res: Response) => {
  const userId = req.user?.id;
  const { id } = req.query;
  if (!id) {
    throw new ApiError(404, "Id of todo required");
  }

  const todoId = Number(id);

  const findTodo = await prisma.todo.findFirst({
    where: {
      id: todoId,
    },
  });

  if (findTodo?.ownerId !== userId) {
    throw new ApiError(
      404,
      "You Are not authorized to Delete  the todo as you are not the owner"
    );
  }

  await prisma.todo.delete({
    where: {
      id: findTodo?.id,
    },
  });

  res.status(200).json(new ApiResponse(200, "", "Successfuly delted the todo"));
});

const getAllTodo = asyncHandler(async (req: Request | any, res: Response) => {
  const userId = req.user?.id;

  const allTodo = await prisma.todo.findMany({
    where: {
      ownerId: userId,
    },
  });

  res
    .status(200)
    .json(new ApiResponse(200, allTodo, "All Todo Fetched Succesfully"));
});

const getTodoById = asyncHandler(async (req: Request | any, res: Response) => {
  const userId = req.user?.id;
  const { id } = req.query;
  if (!id) {
    throw new ApiError(404, "Id of todo required");
  }

  const todoId = Number(id);

  const findTodo = await prisma.todo.findFirst({
    where: {
      id: todoId,
    },
  });

  if (userId !== findTodo?.ownerId) {
    throw new ApiError(
      404,
      "You Are not authorized to Get this todo as you are not the owner"
    );
  }

  res
    .status(200)
    .json(new ApiResponse(200, findTodo, "Fetched the todo succesfuly"));
});

export { addTodo, updateTodo, deleteTodo, getAllTodo, getTodoById };
