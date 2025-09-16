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

export const addStore = async (storeData) => {
  const res = await API.post('/stores/add-store', storeData, { withCredentials: true });
  return res.data;
};

export const getUserStores = async (userId) => {
  try {
    const res = await API.get(`/stores/user/${userId}`);
    return res.data;
  } catch (err) {
    console.error(err);
    return [];
  }
};