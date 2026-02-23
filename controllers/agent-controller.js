import User from "../models/User-model.js";
import Property from "../models/Property-model.js";
import Commercial from "../models/Commercial-model.js";
import Plot from "../models/Plot-model.js";
import Inquiry from "../models/Inquiry-model.js";

export const getAllListings = async (req, res) => {
  try {
    const agents = await User.find({ role: "agent" })
      .select("-password")
      .lean();
    const agentsWithStats = await Promise.all(
      agents.map(async (agent) => {
        const [resCount, commCount, plotCount] = await Promise.all([
          Property.countDocuments({ agent: agent._id }),
          Commercial.countDocuments({ agent: agent._id }),
          Plot.countDocuments({ agent: agent._id }),
        ]);
        return {
          ...agent,
          id: agent._id,
          listings: resCount + commCount + plotCount,
          image: agent.profileImage || "https://via.placeholder.com/200",
          location: agent.location || "Not specified",
          specialty: agent.specialty || "Real Estate Expert",
          experience: agent.experience || "New Associate",
        };
      }),
    );

    res.json(agentsWithStats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSingleAgent = async (req, res) => {
  try {
    const agent = await User.findById(req.params.id).select("-password");
    if (!agent || agent.role !== "agent") {
      return res.status(404).json({ error: "Agent not found" });
    }

    const totalListings =
      (await Property.countDocuments({ agent: req.params.id })) +
      Commercial.countDocuments({ agent: req.params.id }) +
      Plot.countDocuments({ agent: req.params.id });

    res.json({
      ...agent.toObject(),
      id: agent._id,
      listings: totalListings,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAgentDashboardData = async (req, res) => {
  try {
    const agentId = req.user.id || req.user._id;

    if (!agentId) {
      return res.status(401).json({ error: "User ID not found in token" });
    }

    const [residential, commercial, plots, inquiries] = await Promise.all([
      Property.find({ agent: agentId }).sort({ createdAt: -1 }),
      Commercial.find({ agent: agentId }).sort({ createdAt: -1 }),
      Plot.find({ agent: agentId }).sort({ createdAt: -1 }),
      Inquiry.find({ agent: agentId }).sort({ createdAt: -1 }),
    ]);

    const allListings = [
      ...residential.map((item) => ({ ...item._doc, type: "Residential" })),
      ...commercial.map((item) => ({ ...item._doc, type: "Commercial" })),
      ...plots.map((item) => ({ ...item._doc, type: "Plot" })),
    ];
    const totalViews = allListings.reduce(
      (sum, item) => sum + (item.views || 0),
      0,
    );

    res.status(200).json({
      stats: {
        activeListings: allListings.length,
        totalInquiries: inquiries.length,
        propertyViews: totalViews,
      },
      listings: allListings,
      inquiries: inquiries,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
