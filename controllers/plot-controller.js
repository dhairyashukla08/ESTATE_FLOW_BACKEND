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
    const { city, minPrice, maxPrice } = req.query;
    let query = {};
    if (city) query["address.city"] = { $regex: city, $options: "i" };
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    const plots = await Plot.find(query)
      .populate("agent", "name email phoneNumber")
      .sort("-createdAt");
    res.status(200).json(plots);
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
