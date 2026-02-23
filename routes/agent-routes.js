import express from "express";
import {
  getAgentDashboardData,
  getAllListings,
  getSingleAgent,
} from "../controllers/agent-controller.js";
import { verifyToken } from "../middlewares/auth-middleware.js";
const router = express.Router();

router.get("/", getAllListings);

router.get("/stats", verifyToken, getAgentDashboardData);

router.get("/:id", getSingleAgent);

export default router;
