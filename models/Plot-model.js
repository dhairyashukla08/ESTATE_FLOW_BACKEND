import mongoose from "mongoose";
const PlotSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    purpose: { type: String, default: "Sale" },
    propertyType: {
      type: String,
      enum: ["Residential", "Agricultural", "Industrial"],
      required: true,
    },
    price: { type: Number, required: true },
    images: [{ type: String }],
    address: {
      area: String,
      city: String,
    },
    features: {
      plotArea: { type: Number, required: true },
      boundaryWall: { type: Boolean, default: false },
      cornerPlot: { type: Boolean, default: false },
    },
    agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    agentName: { type: String },
    agentPhone: { type: String },
    agentSpecialty: { type: String },
    agentExperience: { type: String },
    agentLocation: { type: String },
    createdAt: { type: Date, default: Date.now },
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);
export default mongoose.model("Plot", PlotSchema);
