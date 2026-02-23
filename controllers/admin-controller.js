import Property from "../models/Property-model.js";
import User from "../models/User-model.js";
import Commercial from "../models/Commercial-model.js";
import Plot from "../models/Plot-model.js";

export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const residentialCount = await Property.countDocuments();
    const commercialCount = await Commercial.countDocuments();
    const plotCount = await Plot.countDocuments();

    const residentialList = await Property.find()
      .populate("agent", "name")
      .lean();
    const residentialWithCat = residentialList.map((item) => ({
      ...item,
      category: "Residential",
    }));

    const commercialList = await Commercial.find()
      .populate("agent", "name")
      .lean();
    const commercialWithCat = commercialList.map((item) => ({
      ...item,
      category: "Commercial",
    }));

    const plotList = await Plot.find().populate("agent", "name").lean();
    const plotWithCat = plotList.map((item) => ({ ...item, category: "Plot" }));

    const allListings = [
      ...residentialWithCat,
      ...commercialWithCat,
      ...plotWithCat,
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const usersList = await User.find().select("-password").sort("-createdAt");

    res.status(200).json({
      stats: {
        totalUsers,
        totalListings: residentialCount + commercialCount + plotCount,
        residential: residentialCount,
        commercial: commercialCount,
        plots: plotCount,
      },
      listings: allListings,
      users: usersList,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
