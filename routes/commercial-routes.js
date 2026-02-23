import express from "express";
import {
  addCommercialProperty,
  getAllCommercial,
  getAllCommercialById,
  updateCommercial,
  deleteCommercial,
} from "../controllers/commercial-controller.js";
import { verifyToken } from "../middlewares/auth-middleware.js";
const router = express.Router();

router.get("/all", getAllCommercial);

router.get("/:id", getAllCommercialById);

router.post("/add", verifyToken, addCommercialProperty);

router.put("/update/:id", verifyToken, updateCommercial);

router.delete("/:id", verifyToken, deleteCommercial);

export default router;
