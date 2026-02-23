import Inquiry from "../models/Inquiry-model.js";
export const createInquiry = async (req, res) => {
  try {
    const { agentId, propertyId, name, email, phone, message } = req.body;

    const newInquiry = new Inquiry({
      agent: agentId,
      property: propertyId || null,
      user: req.user ? req.user.id : null,
      name,
      email,
      phone,
      message,
    });

    await newInquiry.save();
    res.status(201).json({ message: "Inquiry sent successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAgentInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find({ agent: req.user.id })
      .populate("property", "title price")
      .sort({ createdAt: -1 });

    res.status(200).json(inquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
