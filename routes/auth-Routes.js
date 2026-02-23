import express from "express";
import {
  Register,
  Login,
  updateProfile,
} from "../controllers/auth-controller.js";
import { verifyToken } from "../middlewares/auth-middleware.js";
const router = express.Router();

router.post("/register", Register);

router.post("/login", Login);

router.put("/update-profile", verifyToken, updateProfile);

export default router;
