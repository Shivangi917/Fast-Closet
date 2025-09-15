import Store from '../models/Store.model.js';

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
          $maxDistance: 5000
        }
      }
    }).populate('products');

    res.json(stores);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server Error" });
  }
};