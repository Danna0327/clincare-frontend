import axiosClient from "./axiosClient";

export const authService = {
  login: async (username, password) => {
    const { data } = await axiosClient.post("/auth/login", {
      username,
      password,
    });
    return data;
  },
};
