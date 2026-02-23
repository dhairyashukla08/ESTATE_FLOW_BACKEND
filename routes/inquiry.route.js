import express from "express";
import { verifyToken } from "../middlewares/auth-middleware.js";
import {
  createInquiry,
  getAgentInquiries,
} from "../controllers/inquiry.controller.js";
const router = express.Router();

router.get("/my-leads", verifyToken, getAgentInquiries);

router.post("/send", createInquiry);

export default router;
