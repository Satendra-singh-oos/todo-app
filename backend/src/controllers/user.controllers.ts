import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";
import asyncHandler from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { loginSchema, userSchema } from "../validations/user.validations";
import prisma from "../prisma";

const genrateAccessAndRefreshToken = async (userId: number) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new ApiError(404, "No user Found");
    }

    const accessToken = await jwt.sign(
      {
        id: user?.id,
        email: user?.email,
        name: user?.name,
      },
      process.env.ACCESS_TOKEN_SECRET as string,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
      }
    );

    const refreshToken = await jwt.sign(
      { id: user?.id },
      process.env.REFERESH_TOKEN_SECRET as string,
      {
        expiresIn: process.env.REFERESH_TOKEN_EXPIRY,
      }
    );

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        refreshToken: refreshToken,
      },
    });

    return { accessToken, refreshToken };
  } catch (error: any) {
    throw new ApiError(500, error.message);
  }
};

const registerUser = asyncHandler(async (req: Request, res: Response) => {
  try {
    const userData = userSchema.parse(req.body);

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const checkUser = await prisma.user.findFirst({
      where: {
        email: userData.email,
      },
    });

    if (checkUser) {
      throw new ApiError(401, "Email Already Exist");
    }

    const createdUser = await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
      },
    });

    const user = {
      id: createdUser.id,
      name: createdUser.name,
      email: createdUser.email,
    };
    res
      .status(200)
      .json(new ApiResponse(200, user, "Account Created Successfully"));
  } catch (error: any) {
    throw new ApiError(500, error.message);
  }
});

const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const userData = loginSchema.parse(req.body);

  const findUser = await prisma.user.findFirst({
    where: {
      email: userData.email,
    },
  });

  if (!findUser) {
    throw new ApiError(400, "User Dosenot exist in db");
  }

  const isPasswordCorrect = await bcrypt.compare(
    userData.password,
    findUser.password
  );

  if (!isPasswordCorrect) {
    throw new ApiError(404, "Wrong Password");
  }

  const { refreshToken, accessToken } = await genrateAccessAndRefreshToken(
    findUser.id
  );

  const loggedInUser = await prisma.user.findFirst({
    where: {
      id: findUser.id,
    },
  });

  const options = {
    httpOnly: true,
    secure: true,
  };

  const user = {
    name: loggedInUser?.name,
    email: loggedInUser?.email,
  };

  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: user, accessToken, refreshToken },
        "User logged In Succesfully"
      )
    );
});

const refreshAccesToken = asyncHandler(async (req: Request, res: Response) => {
  const incomingRefreshToken =
    req.cookies?.refreshToken ||
    req.body?.refreshToken ||
    req.headers?.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(402, "No Refresh Token Found");
  }
  const verifyiedRefreshToken = jwt.verify(
    incomingRefreshToken,
    process.env.REFERESH_TOKEN_SECRET as string
  ) as JwtPayload;

  if (!verifyiedRefreshToken) {
    throw new ApiError(404, "Your Refresh Token is used kindle login again");
  }

  const userId = verifyiedRefreshToken.id;

  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new ApiError(
      404,
      "Refersh Token dosen't match might be expierd or used , Try Login Again"
    );
  }
  const { refreshToken, accessToken } =
    await genrateAccessAndRefreshToken(userId);

  const options = {
    httpOnly: true,
    secure: true,
  };

  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { accessToken, newRefreshToken: refreshToken },
        "Acces Token Refreshed Succesfully"
      )
    );
});

const changeCurrentPassword = asyncHandler(
  async (req: Request | any, res: Response) => {
    const userId = req.user?.id;

    const { oldPassword, newPassword } = req.body;

    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new ApiError(404, "No User Found");
    }

    const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordCorrect) {
      throw new ApiError(403, "Incorrect Passowrd || Old Password Don't Match");
    }

    const newEncryptedPass = await bcrypt.hash(newPassword, 10);

    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: newEncryptedPass,
      },
    });

    res
      .status(200)
      .json(
        new ApiResponse(200, updatedUser, "Succesfully Updated The password")
      );
  }
);

const getCurrentUser = asyncHandler(
  async (req: Request | any, res: Response) => {
    const user = req.user;

    if (!user) {
      throw new ApiError(400, "No UserId Found");
    }

    res
      .status(200)
      .json(new ApiResponse(200, user, "Succesfully Fetched User Details"));
  }
);

const updateUserAccountDetails = asyncHandler(
  async (req: Request | any, res: Response) => {
    const userId = req.user?.id;

    const { name } = req.body;

    const checkUser = await prisma.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!checkUser) {
      throw new ApiError(404, "No User Found");
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: checkUser.id,
      },
      data: {
        name,
      },
    });

    res
      .status(200)
      .json(
        new ApiResponse(200, updatedUser, "AccountDetailsUpdatedSuccesfuly")
      );
  }
);

export {
  registerUser,
  loginUser,
  refreshAccesToken,
  changeCurrentPassword,
  getCurrentUser,
  updateUserAccountDetails,
};
