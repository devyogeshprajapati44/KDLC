import API from "../api/axios";

export const getOrders = async () => {
  const res = await API.get("/orders/my-orders");
  return res.data;
};

export const getAllOrders = async () => {
  const res = await API.get("/orders/all-orders");
  return res.data;
};

export const updateOrderStatus = async (id, status) => {
  const res = await API.patch(`/orders/${id}/status`, {
    status,
  });
  return res.data;
};

export const getOrderTracking = async (id) => {
  const res = await API.get(`/orders/${id}/track`);
  return res.data;
};
