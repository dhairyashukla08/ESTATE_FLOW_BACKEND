import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import mongoose from "mongoose";

import authRoutes from "./routes/auth-Routes.js";
import propertyRoutes from "./routes/property-routes.js";
import commercialRoutes from "./routes/commercial-routes.js";
import plotRoutes from "./routes/plot-routes.js";
import inquiryRoutes from "./routes/inquiry.route.js";
import agentRoutes from "./routes/agent-routes.js";
import adminRoutes from "./routes/admin-routes.js";
const PORT = process.env.PORT || 8000;

const app = express();

const corsOptions = {
  origin: ["http://localhost:5173","https://estate-flow-frontend.netlify.app/"],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(express.json({ limit: "10mb" }));
app.use(cors(corsOptions));

app.use((req, res, next) => {
  const timestamp = new Date().toLocaleString();
  console.log(
    `[${timestamp}] ${req.method} | PATH: ${req.path} | FULL URL: ${req.url}`,
  );
  next();
});

app.use("/api/auth", authRoutes);

app.use("/api/properties", propertyRoutes);

app.use("/api/commercial", commercialRoutes);

app.use("/api/plots", plotRoutes);

app.use("/api/inquiries", inquiryRoutes);

app.use("/api/agents", agentRoutes);

app.use("/api/admin", adminRoutes);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
};

connectDB();

app.get("/", (req, res) => {
  res.send("EstateFlow Backend API is running...");
});

app.listen(PORT, () => {
  console.log(`Server is Running on ${PORT}`);
});
