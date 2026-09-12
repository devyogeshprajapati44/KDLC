import API from "../api/axios";

export const getUserList = async () => {
  const res = await API.get("/auth/userlist");

  console.log(res.data);

  return res.data.data;
};

export const registerUser = async (userData) => {
  const res = await API.post("/auth/register", userData);

  return res.data;
};

export const deleteUser = async (id) => {
  const token = localStorage.getItem("accessToken");

  const response = await API.delete(`/auth/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};