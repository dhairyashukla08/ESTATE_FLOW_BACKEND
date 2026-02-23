import Commercial from "../models/Commercial-model.js";

export const addCommercialProperty = async (req, res) => {
  try {
    const {
      title,
      description,
      purpose,
      propertyType,
      price,
      images,
      address,
      carpetArea,
      bathrooms,
      parking,
      maintenance,
    } = req.body;

    const newCommercial = new Commercial({
      title,
      description,
      purpose,
      propertyType,
      price: Number(price),
      images,
      address,
      agent: req.user.id,
      features: {
        carpetArea: Number(carpetArea || req.body.features?.carpetArea),
        bathrooms: Number(bathrooms || 0),
        parking: parking || "Available",
        maintenance: Number(maintenance || 0),
      },
    });

    const savedProperty = await newCommercial.save();
    res.status(201).json(savedProperty);
  } catch (error) {
    console.error("Commercial Save Error:", error.message);
    res
      .status(500)
      .json({
        message: "Error creating commercial property",
        error: error.message,
      });
  }
};

export const getAllCommercial = async (req, res) => {
  try {
    const { city, purpose, minPrice, maxPrice } = req.query;
    let query = {};
    if (city) query["address.city"] = { $regex: city, $options: "i" };
    if (purpose) query.purpose = purpose;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    const properties = await Commercial.find(query)
      .populate("agent", "name email phoneNumber")
      .sort("-createdAt");
    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllCommercialById = async (req, res) => {
  try {
    const property = await Commercial.findById(req.params.id).populate(
      "agent",
      "name email phoneNumber",
    );
    if (!property)
      return res.status(404).json({ message: "Property not found" });
    res.status(200).json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCommercial = async (req, res) => {
  try {
    const updated = await Commercial.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          ...req.body,
          features: {
            carpetArea: req.body.carpetArea,
            bathrooms: req.body.bathrooms,
            parking: req.body.parking,
            maintenance: req.body.maintenance,
          },
        },
      },
      { new: true },
    );
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
};

export const deleteCommercial = async (req, res) => {
  try {
    await Commercial.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Commercial property deleted" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
};
