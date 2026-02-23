import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["buyer", "agent", "admin"],
      default: "buyer",
    },
    phoneNumber: {
      type: String,
    },
    isAgent: { type: Boolean, default: false },
    experience: { type: String },
    specialty: { type: String },
    listingsCount: { type: Number, default: 0 },
    location: {
      type: String,
      default: "Not specified",
    },
    rating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const User = mongoose.model("User", UserSchema);
export default User;
