import API from "./api"; // your axios instance

export const searchQuery = async (query) => {
  const res = await API.get(`/search`, { params: { query } });
  return res.data;
};

export const autocompleteQuery = async (query) => {
  const res = await API.get(`/search/autocomplete`, { params: { query } });
  return res.data;
};
