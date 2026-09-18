import Property from "../models/Property-model.js";
import Commercial from "../models/Commercial-model.js";
import Plot from "../models/Plot-model.js";

export const createProperty = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      purpose,
      category,
      area,
      city,
      bedrooms,
      bathrooms,
      areaSize,
      furnishedStatus,
      highlights,
      images,
    } = req.body;
    const newProperty = new Property({
      title,
      description,
      price,
      purpose,
      category,
      address: { area, city },
      features: {
        bedrooms: bedrooms || 0,
        bathrooms: bathrooms || 0,
        areaSize,
        furnishedStatus: purpose === "Rent" ? (furnishedStatus || "Unfurnished") : undefined,
      },
      highlights: highlights || [],
      images: images || [],
      agent: req.user.id,
      agentName: req.user.name,
      contact: req.user.phoneNumber,
    });
    const savedProperty = await newProperty.save();
    res.status(201).json(savedProperty);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating property", error: error.message });
  }
};

export const getProperties = async (req, res) => {
  try {
    const { city, purpose, category, minPrice, maxPrice, minArea, maxArea, bedrooms, bathrooms, furnishing, sort,} = req.query;
    let query = {};
    const csv = (v) => String(v).split(",").map((s) => s.trim()).filter(Boolean);
    if (city) query["address.city"] = new RegExp(city.trim(), "i");
    if (purpose) query.purpose = purpose;
    if (category) query.category = category;
    if (furnishing) query["features.furnishedStatus"] = { $in: csv(furnishing) };
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

     if (minArea || maxArea) {
      query["features.areaSize"] = {};
      if (minArea) query["features.areaSize"].$gte = Number(minArea);
      if (maxArea) query["features.areaSize"].$lte = Number(maxArea);
    }

    if (bathrooms) query["features.bathrooms"] = { $gte: Number(bathrooms) };

     if (bedrooms) {
      const nums = csv(bedrooms).map(Number).filter((n) => !Number.isNaN(n));
      const exact = nums.filter((n) => n < 5);
      const or = [];
      if (exact.length) or.push({ "features.bedrooms": { $in: exact } });
      if (nums.some((n) => n >= 5)) or.push({ "features.bedrooms": { $gte: 5 } });
      if (or.length === 1) Object.assign(query, or[0]);
      else if (or.length > 1) query.$or = or;
    }

     const sortMap = {
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      area_desc: { "features.areaSize": -1 },
      newest: { createdAt: -1 },
    };

    const properties = await Property.find(query)
      .populate("agent", "name phoneNumber")
      .sort(sortMap[sort] || { createdAt: -1 });
    res.status(200).json(properties);
  } catch (error) {
    console.error("Backend Error:", error);
    res
      .status(500)
      .json({ message: "Error fetching properties", error: error.message });
  }
};

export const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate(
      "agent",
      "name phoneNumber",
    );
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }
    res.status(200).json(property);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching property", error: error.message });
  }
};

export const incrementViewCount = async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.query;
    let model;
    if (type === "Commercial") model = Commercial;
    else if (type === "Plot") model = Plot;
    else model = Property;

    const updatedProperty = await model.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true },
    );
    if (!updatedProperty) {
      return res.status(404).json({ message: "Property not found" });
    }
    res.status(200).json({ views: updatedProperty.views });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateProperty = async (req, res) => {
  try {
    const updated = await Property.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          ...req.body,
          address: { area: req.body.area, city: req.body.city },
          features: {
            bedrooms: req.body.bedrooms,
            bathrooms: req.body.bathrooms,
            areaSize: req.body.areaSize,
            furnishedStatus:
              req.body.purpose === "Rent"
                ? (req.body.furnishedStatus || "Unfurnished")
                : undefined,
          },
        },
      },
      { new: true },
    );
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Update failed", error: error.message });
  }
};

export const deleteProperty = async (req, res) => {
  try {
    await Property.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Property deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed", error: error.message });
  }
};
