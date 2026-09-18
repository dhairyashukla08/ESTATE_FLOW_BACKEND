import Plot from "../models/Plot-model.js";

export const addPlot = async (req, res) => {
  try {
    const { title, description, price, images, address, propertyType } =
      req.body;

    const plotAreaValue = req.body.features?.plotArea || req.body.plotArea;

    const newPlot = new Plot({
      title,
      description,
      purpose: "Sale",
      propertyType: propertyType === "Office" ? "Residential" : propertyType,
      price: Number(price),
      images,
      address,
      agent: req.user.id,
      features: {
        plotArea: Number(plotAreaValue),
      },
    });

    const savedPlot = await newPlot.save();
    res.status(201).json(savedPlot);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating plot listing", error: error.message });
  }
};

export const getAllPlots = async (req, res) => {
  try {
       const { city, propertyType, minPrice, maxPrice, minArea, maxArea, sort } = req.query;
    let query = {};
    const csv = (v) => String(v).split(",").map((s) => s.trim()).filter(Boolean);
    if (city) query["address.city"] = { $regex: city.trim(), $options: "i" };

    if (propertyType) query.propertyType = { $in: csv(propertyType) };
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (minArea || maxArea) {
      query["features.plotArea"] = {};
      if (minArea) query["features.plotArea"].$gte = Number(minArea);
      if (maxArea) query["features.plotArea"].$lte = Number(maxArea);
    }

     const sortMap = {
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      area_desc: { "features.plotArea": -1 },
      newest: { createdAt: -1 },
    };


    const plots = await Plot.find(query)
      .populate("agent", "name email phoneNumber")
      .sort(sortMap[sort] || { createdAt: -1 });
    res.status(200).json(plots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPlotById = async (req, res) => {
  try {
    const plot = await Plot.findById(req.params.id).populate("agent", "name email phoneNumber");
    if (!plot) return res.status(404).json({ message: "Plot not found" });
    res.status(200).json(plot);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePlot = async (req, res) => {
  try {
    const updated = await Plot.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          ...req.body,
          features: { plotArea: req.body.plotArea },
        },
      },
      { new: true },
    );
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Update failed", error: error.message });
  }
};

export const deletePlot = async (req, res) => {
  try {
    await Plot.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Plot deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
};
