import Property from "../models/propertyModel.js";


export const addProperty = async (req, res) => {
  try {
    console.log(req.admin);
    
    // 4. Save property
    const propertyData = {
      ...req.body,
      listedBy: req.admin.id, // associate property with admin who added it
    };

    const newProperty = new Property(propertyData);
    await newProperty.save();

    // 5. Optional: Invalidate or update cache of property list
    // await client.del("properties:list"); // force refresh of cached property list

    res.status(201).json({
      success: true,
      message: "Property added successfully",
      data: newProperty,
    });

  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find();
    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
