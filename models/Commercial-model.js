import mongoose from "mongoose";
const CommercialSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    purpose: { type: String, enum: ["Sale", "Rent"], required: true },
    propertyType: {
      type: String,
      enum: ["Office", "Shop", "Warehouse", "Showroom"],
      required: true,
    },
    price: { type: Number, required: true },
    images: [{ type: String }],
    address: {
      area: String,
      city: String,
    },
    features: {
      carpetArea: { type: Number, required: true },
      bathrooms: Number,
      parking: String,
      maintenance: Number,
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
export default mongoose.model("Commercial", CommercialSchema);
