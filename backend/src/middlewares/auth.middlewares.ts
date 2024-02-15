import jwt, { JwtPayload } from "jsonwebtoken";
import { ApiError } from "../utils/ApiError";
import asyncHandler from "../utils/asyncHandler";
import { NextFunction, Request, Response } from "express";
import prisma from "../prisma";

export const verifyJwt = asyncHandler(
  async (req: Request | any, _: Response, next: NextFunction) => {
    try {
      const token =
        req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "");

      const verifyedToken = (await jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET as string
      )) as JwtPayload;

      const userId = verifyedToken?.id;
      const findUser = await prisma.user.findFirst({
        where: {
          id: userId,
        },
      });

      if (!findUser) {
        throw new ApiError(405, "Invalid Access Token");
      }

      const user = {
        name: findUser.name,
        email: findUser.email,
        role: findUser.role,
      };

      req.user = user;
      next();
    } catch (error: any) {
      throw new ApiError(500, error);
    }
  }
);
