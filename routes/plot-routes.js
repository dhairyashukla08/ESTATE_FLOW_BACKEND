import express from "express";
import {
  addPlot,
  getAllPlots,
  updatePlot,
  deletePlot,
} from "../controllers/plot-controller.js";
import { verifyToken } from "../middlewares/auth-middleware.js";
const router = express.Router();

router.get("/all", getAllPlots);

router.post("/add", verifyToken, addPlot);

router.put("/update/:id", verifyToken, updatePlot);

router.delete("/:id", verifyToken, deletePlot);

export default router;
