import API from "../api/axios";

export const getInvoice = async (id) => {

  const response = await API.get(
    `/orders/invoice/${id}`,
    {
      responseType: "blob",
    }
  );

  return response.data;
};


export const deleteOrder = async (id) => {
  const response = await API.delete(`/orders/invoice/${id}`);
  return response.data;
};