import { Router } from "express";
import {
  registerUser,
  loginUser,
  refreshAccesToken,
  changeCurrentPassword,
  getCurrentUser,
  updateUserAccountDetails,
} from "../controllers/user.controllers";
import { verifyJwt } from "../middlewares/auth.middlewares";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/refresh-token").post(refreshAccesToken);

router.route("/change-password").post(verifyJwt, changeCurrentPassword);
router.route("/getCurrentUser").get(verifyJwt, getCurrentUser);
router.route("/update-account").patch(verifyJwt, updateUserAccountDetails);

export default router;
