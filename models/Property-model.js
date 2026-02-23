import mongoose from "mongoose";

const PropertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a property title"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please provide a description"],
    },
    price: {
      type: Number,
      required: [true, "Please provide a price"],
    },
    purpose: {
      type: String,
      enum: ["Buy", "Rent"],
      required: true,
    },
    category: {
      type: String,
      enum: ["Apartment", "Villa", "Plot"],
      required: true,
    },
    images: {
      type: [String],
      default: ["https://images.unsplash.com/photo-1560518883-ce09059eeffa"],
    },
    address: {
      area: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String },
      pincode: { type: String },
    },
    features: {
      bedrooms: { type: Number, default: 0 },
      bathrooms: { type: Number, default: 0 },
      areaSize: { type: Number, required: true },
      furnishedStatus: {
        type: String,
        enum: ["Furnished", "Semi-Furnished", "Unfurnished"],
        default: "Unfurnished",
      },
    },
    highlights: {
      type: [String],
      default: [],
    },
    agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    agentName: { type: String },
    contact: { type: String },
    agentPhone: { type: String },
    agentSpecialty: { type: String },
    agentExperience: { type: String },
    agentLocation: { type: String },
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

PropertySchema.index({ "address.city": "text", title: "text" });
const Property = mongoose.model("Property", PropertySchema);
export default Property;
