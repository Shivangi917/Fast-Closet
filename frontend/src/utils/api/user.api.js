import API from "./api";

export const getUserDetails = async (userId) => {
    try {
    const res = await API.get(`/user/info/${userId}`);
    return res.data;
  } catch (err) {
    console.error("Error getting user details: ", err);
    throw err;
  }
}