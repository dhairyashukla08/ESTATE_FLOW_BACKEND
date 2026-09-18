import express from "express";
import {
  addPlot,
  getAllPlots,
  updatePlot,
  deletePlot,
  getPlotById,
} from "../controllers/plot-controller.js";
import { verifyToken } from "../middlewares/auth-middleware.js";
const router = express.Router();

router.get("/all", getAllPlots);

router.post("/add", verifyToken, addPlot);

router.get("/:id", getPlotById);

router.put("/update/:id", verifyToken, updatePlot);

router.delete("/:id", verifyToken, deletePlot);

export default router;
