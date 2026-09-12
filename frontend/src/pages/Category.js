import React, { useEffect, useState, useCallback } from "react";
import Swal from "sweetalert2";

import {
  addCategory,
  getAllCategory,
  updateCategories,
  deleteCategories as deleteCategoriesAction,
} from "../services/categoryService";

import Loader from "../components/Loader";
import CategoryTree from "../pages/components/CategoryTree";
import AddCategoryModal from "../pages/components/AddCategoryModal";
import UpdateCategoriesModal from "../pages/components/UpdateCategoriesModal";
import DeleteCategoryModal from "../pages/components/DeleteCategoryModal";

import "./Category.css";

function Category() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // Add modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [parentCategoryId, setParentCategoryId] = useState("");
  const [categoryImage, setCategoryImage] = useState(null);

  // Selection
  const [selectedIds, setSelectedIds] = useState([]);

  // Update/Delete
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  const loadCategories = useCallback(async () => {

    try {

      setLoading(true);

      const res = await getAllCategory();

      if(res.success){
        setCategories(res.data || []);
      }
      else{
        setCategories([]);
      }

    }
    catch(error){

      console.log(error);

      Swal.fire(
        "Error",
        "Unable to load categories",
        "error"
      );

    }
    finally{
      setLoading(false);
    }
  }, []);

  useEffect(()=>{

    loadCategories();

  },[loadCategories]);

  const flattenCategories = (list=[], result=[])=>{

    list.forEach(item=>{

      result.push({

        value:item._id,
        name:item.name,
        parentId:item.parentId,
        type:item.type

      });

      if(item.children?.length){

        flattenCategories(
          item.children,
          result
        );

      }

    });
    return result;
  }
  const categoryList =
    flattenCategories(categories);

  const toggleSelect=(id)=>{

    setSelectedIds(prev=>

      prev.includes(id)

      ? prev.filter(x=>x!==id)

      : [...prev,id]

    );

  };
  const getSelectedItems=()=>{
    const list = flattenCategories(categories);
    const items = selectedIds
    .map(id=>
      list.find(item=>item.value===id)
    )
    .filter(Boolean);


    setSelectedItems(items);

    return items;

  };

  const handleCategoryImage=(e)=>{

    setCategoryImage(
      e.target.files[0]
    );

  };
  const handleAddCategory=async()=>{
    if(!categoryName.trim()){
      Swal.fire(
        "Required",
        "Enter category name",
        "warning"
      );
      return;
    }
    const formData=new FormData();
    formData.append(
      "name",
      categoryName
    );
    formData.append(
      "parentId",
      parentCategoryId || ""
    );

    formData.append(
      "type",
      "product"
    );
    if(categoryImage){

      formData.append(
        "categoryImage",
        categoryImage
      );

    }
    try{
      setLoading(true);
      await addCategory(formData);
      Swal.fire(
        "Success",
        "Category added successfully",
        "success"
      );

      setCategoryName("");
      setParentCategoryId("");
      setCategoryImage(null);
      setShowAddModal(false);
      loadCategories();
    }
    catch(error){


      Swal.fire(
        "Error",
        error.response?.data?.message ||
        "Add failed",
        "error"
      );


    }
    finally{

      setLoading(false);

    }


  };

  const openUpdateModal=()=>{

    const items=getSelectedItems();

    if(items.length===0){

      Swal.fire(
        "Select Category",
        "Please select category first",
        "info"
      );

      return;

    }
    setShowUpdateModal(true);
  };
  const handleCategoryFieldChange=(key,value,index)=>{
    setSelectedItems(prev=>

      prev.map((item,i)=>

        i===index

        ? {
          ...item,
          [key]:value
        }

        : item

      )

    );

  };
  const submitCategoryUpdates=async()=>{
    try{
      setLoading(true);
      const item=selectedItems[0];
      await updateCategories({
        _id:item.value,
        name:item.name,
        parentId:item.parentId || "",
        type:item.type || "product"

      });
      Swal.fire(
        "Updated",
        "Category updated successfully",
        "success"
      );
      setShowUpdateModal(false);
      setSelectedIds([]);
      setSelectedItems([]);
      loadCategories();

    }
    catch(error){
      Swal.fire(
        "Error",
        "Update failed",
        "error"
      );
    }
    finally{
      setLoading(false);

    }


  };

  const openDeleteModal=()=>{
    const items=getSelectedItems();
    if(items.length===0){
      Swal.fire(
        "Select Category",
        "Please select category first",
        "info"
      );
      return;

    }
    setShowDeleteModal(true);
  };
  const confirmDeleteCategories=async()=>{
    try{
      setLoading(true);
      const ids =
      selectedItems.map(item=>({

        _id:item.value

      }));
      await deleteCategoriesAction(ids);
      Swal.fire(
        "Deleted",
        "Category deleted successfully",
        "success"
      );
      setSelectedIds([]);
      setSelectedItems([]);
      setShowDeleteModal(false);
      loadCategories();
    }
    catch(error){
      Swal.fire(
        "Error",
        "Delete failed",
        "error"
      );
    }
    finally{
      setLoading(false);
    }
  };

return (

<div className="category-page">
        <div className="category-header">
              <div>
                <h1>Categories</h1>
                <p>
                  <span className="header-count">
                  {categoryList.length}
                  </span>
                  total
                  </p>
            </div>

          <div className="category-actions">
              <button className="add-product-btn" onClick={()=>setShowAddModal(true)} >
                <i className="bi bi-plus-lg"></i> Add Category
              </button>
              <button className="btn-outline-action edit" onClick={openUpdateModal} >
                <i className="bi bi-pencil"></i> Edit 
              </button>
              <button className="btn-outline-action delete" onClick={openDeleteModal}>
                <i className="bi bi-trash3"></i>Delete
              </button>
          </div>
        </div>
        <div className="category-tree-card">
            {
              loading ? <Loader/>:
                <CategoryTree categories={categories} selectedIds={selectedIds} onToggle={toggleSelect} />
            }
        </div>
          <AddCategoryModal
              show={showAddModal}
              onClose={()=>setShowAddModal(false)}
              onSubmit={handleAddCategory}
              categoryName={categoryName}
              setCategoryName={setCategoryName}
              parentCategoryId={parentCategoryId}
              setParentCategoryId={setParentCategoryId}
              categoryList={categoryList}
              categoryImage={categoryImage}
              handleCategoryImage={handleCategoryImage}
              loading={loading}
            />

            <UpdateCategoriesModal
                show={showUpdateModal}
                onClose={()=>setShowUpdateModal(false)}
                onSubmit={submitCategoryUpdates}
                items={selectedItems}
                categoryList={categoryList}
                handleCategoryFieldChange={handleCategoryFieldChange}
                loading={loading}
              />

            <DeleteCategoryModal
              show={showDeleteModal}
              onClose={()=>setShowDeleteModal(false)}
              onConfirm={confirmDeleteCategories}
              items={selectedItems}
              loading={loading}
            />
 </div>
 );}

export default Category;