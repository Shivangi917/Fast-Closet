import Store from "../models/Store.model.js";

// Add a new store
export const addStore = async (req, res) => {
  try {
    const { name, description, contactNumber, address, owner } = req.body;

    if (!name || !address || !address.city) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Hardcoded coordinates for testing
    const coordinates = [22.51623605, 88.4172475]; // Example: Google HQ

    const store = new Store({
      name,
      description,
      contactNumber,
      address,
      location: { type: "Point", coordinates },
      owner // frontend passes vendor _id
    });

    await store.save();
    res.status(201).json(store);
  } catch (error) {
    console.error("Error creating store:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all stores
export const getStores = async (req, res) => {
  try {
    const stores = await Store.find().populate("owner", "name email");
    res.json(stores);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get stores info
export const getStoresByUser = async (req, res) => {
  try {
    const stores = await Store.find({ owner: req.params.userId });
    res.json(stores);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get nearby stores
export const getNearbyStores = async (req, res) => {
  const { lat, lng } = req.query;
  if (!lat || !lng) return res.status(400).json({ msg: "Missing coordinates" });

  try {
    const stores = await Store.find({
      location: {
        $near: {
          $geometry: { 
            type: "Point", 
            coordinates: [parseFloat(lng), parseFloat(lat)] 
          },
          $maxDistance: 50000 // 50 km
        }
      }
    }).populate('products')
      .populate("owner", "name email")
      .populate("address");

      console.log(stores);

    res.json(stores);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server Error" });
  }
};
