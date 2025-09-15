import API from "./api";

export const getNearbyStores = async (lat, lng) => {
  try {
    const res = await API.get(`/stores/nearby`, {
      params: { lat, lng },
    });
    return res.data;
  } catch (err) {
    console.error("Error fetching nearby stores:", err);
    throw err;
  }
};