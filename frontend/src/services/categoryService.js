import API from "../api/axios";


// Add Category
export const addCategory = async (data) => {

  const response = await API.post(
    "/category/add",
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};



// Get All Categories
export const getAllCategory = async () => {

  const response = await API.get(
    "/category/all"
  );

  return response.data;
};



// Update Category
export const updateCategories = async (data) => {

  const response = await API.put(
    "/category/update",
    data
  );

  return response.data;
};



// Delete Category
export const deleteCategories = async (ids) => {

  const response = await API.delete(
    "/category/delete",
    {
      data: ids,
    }
  );

  return response.data;
};