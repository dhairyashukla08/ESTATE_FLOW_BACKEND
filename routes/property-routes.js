import express from "express";
import {
  createProperty,
  getProperties,
  getPropertyById,
  incrementViewCount,
  updateProperty,
  deleteProperty,
} from "../controllers/property-controller.js";
import { verifyToken } from "../middlewares/auth-middleware.js";

const router = express.Router();

router.get("/all", getProperties);

router.get("/:id", getPropertyById);

router.post("/add", verifyToken, createProperty);

router.post("/:id/view", incrementViewCount);

router.put("/update/:id", verifyToken, updateProperty);

router.delete("/:id", verifyToken, deleteProperty);

export default router;
