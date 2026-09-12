import API from "../api/axios";

export const getProducts = async (page = 1, limit = 12) => {
  const res = await API.get(`/products?page=${page}&limit=12`);
  return res.data;
};

export const createProduct = async (formData) => {
  const res = await API.post("/products", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

export const updateProduct = async (id, formData) => {
  const res = await API.put(`/products/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};


export const deleteProduct = async (id) => {
  const res = await API.delete(`/products/${id}`);
  return res.data;
};

export const bulkUploadProducts = async (formData, onProgress) => {
  const res = await API.post("/products/bulk-upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const percent = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(percent);
      }
    },
  });
 
  return res.data;
};
