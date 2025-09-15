import API from "./api";

export const loginUser = async ({ email, password }) => {
  const { data } = await API.post("/auth/login", { email, password });
  return data;
};

export const signupUser = async ({ name, email, password }) => {
  const { data } = await API.post("/auth/signup", { name, email, password });
  return data;
};
