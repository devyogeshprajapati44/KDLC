import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";

import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  bulkUploadProducts,
} from "../services/productService";

import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./products.css";
import ProductModal from "../components/ProductModal";
import BulkUploadModal from "../components/BulkUploadModal";



const CATEGORIES = [
  "Mobile",
  "Laptop",
  "Tablet",
  "Accessories",
  "Furniture",
  "Home Temples"
  
];

const EMPTY_SPECS = {
  ram: "",
  storage: "",
  processor: "",
  camera: "",
  frontCamera: "",
  battery: "",
  display: "",
  modelNo: "",
  color: "",
};

const EMPTY_FORM = {
  name: "",
  description: "",
  price: "",
  stock: "",
  images: null,
  category: "",
  country: "",
  brand: "",
  discount: "",
  warranty: "",
  manufacturerInfo: "",
  highlights: "",
  specs: { ...EMPTY_SPECS },
};

const formatPrice = (price, currency) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency?.code || "INR",
  }).format(price);
};

function Products() {
  const navigate = useNavigate();


  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);

  const [showBulkModal, setShowBulkModal] = useState(false);

  // ===== BULK UPLOAD STATE =====
  const [bulkFile, setBulkFile] = useState(null);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkProgress, setBulkProgress] = useState(0);

  const [showProductModal, setShowProductModal] =
    useState(false);

  const [selectedProduct, setSelectedProduct] =
    useState(null);

  const [currentPage, setCurrentPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  const [searchTerm, setSearchTerm] = useState("");

  const [filterCategory, setFilterCategory] =
    useState("");

  const [sortBy, setSortBy] =
    useState("featured");

  const [sortOpen, setSortOpen] =
    useState(false);

  const [form, setForm] =
    useState({
      ...EMPTY_FORM,
      specs: { ...EMPTY_SPECS },
    });
  let user = null;

  try {
    const storedUser =
      localStorage.getItem("user");

    if (storedUser) {
      user = JSON.parse(storedUser);
    }
  } catch (error) {
    console.error(
      "Invalid user data:",
      error
    );
  }

  // ===================================================
  // ROLE
  // ===================================================

  const role = user?.role;

  // SUPER_ADMIN + ADMIN
  const canManageProducts =
    role === "SUPER_ADMIN" ||
    role === "ADMIN";

  const limit = 12;
  const loadProducts = useCallback(
    async () => {
      try {
        setLoading(true);

        const res = await getProducts(currentPage, limit);

        setProducts(res?.data || []);
        setTotalPages(res?.pagination?.totalPages || 1);

      } catch (error) {
        console.error(
          "LOAD PRODUCTS ERROR:",
          error
        );

        setProducts([]);

        if (
          error?.response?.status === 401
        ) {
          Swal.fire(
            "Session Expired",
            "Please login again.",
            "warning"
          );
        }
      } finally {
        setLoading(false);
      }
    },
    [currentPage]
  );


  useEffect(() => {
    loadProducts();
  }, [loadProducts]);


  const visibleProducts =
    useMemo(() => {
      let list = [...products];

      // SEARCH
      if (searchTerm.trim()) {
        const q =
          searchTerm
            .trim()
            .toLowerCase();

        list = list.filter(
          (product) =>
            product.name
              ?.toLowerCase()
              .includes(q) ||
            product.description
              ?.toLowerCase()
              .includes(q)
        );
      }

      // CATEGORY FILTER
      if (filterCategory) {
        list = list.filter(
          (product) =>
            product.category ===
            filterCategory
        );
      }

      // SORT
      switch (sortBy) {
        case "price-asc":
          list.sort(
            (a, b) =>
              (a.price || 0) -
              (b.price || 0)
          );
          break;

        case "price-desc":
          list.sort(
            (a, b) =>
              (b.price || 0) -
              (a.price || 0)
          );
          break;

        case "newest":
          list.sort(
            (a, b) =>
              new Date(
                b.createdAt || 0
              ) -
              new Date(
                a.createdAt || 0
              )
          );
          break;

        default:
          break;
      }

      return list;
    }, [
      products,
      searchTerm,
      filterCategory,
      sortBy,
    ]);

  const sortLabels = {
    featured: "Featured",
    newest: "Newest",
    "price-desc":
      "Price: High-Low",
    "price-asc":
      "Price: Low-High",
  };

  const handleChange = (e) => {
    const {
      name,
      value,
      files,
    } = e.target;

    setForm((prev) => ({
      ...prev,

      [name]:
        name === "images"
          ? files?.[0] || null
          : value,
    }));
  };
  const handleSpecsChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setForm((prev) => ({
      ...prev,

      specs: {
        ...prev.specs,
        [name]: value,
      },
    }));
  };
  const buildFormData = () => {
    const formData =
      new FormData();

    formData.append( "name", form.name );
    formData.append( "description", form.description );
    formData.append( "price",form.price);
    formData.append("stock", form.stock);
    formData.append( "category",form.category);
    formData.append("country", form.country);
    formData.append( "brand",form.brand );
    formData.append( "discount", form.discount || 0 );
    formData.append( "warranty", form.warranty );
    formData.append( "manufacturerInfo", form.manufacturerInfo );

    // HIGHLIGHTS
    const highlightsArray =
      form.highlights
        .split(",")
        .map((item) =>
          item.trim()
        )
        .filter(
          (item) =>
            item.length > 0
        );
    formData.append( "highlights", JSON.stringify( highlightsArray));
    formData.append("specs",JSON.stringify( form.specs ));
    if (form.images) {
      formData.append( "images", form.images ); }
      return formData; };
  const resetForm = () => {
    setForm({
      ...EMPTY_FORM,
      specs: {
        ...EMPTY_SPECS,
      },
    });

    setSelectedProduct(null);
  };


  const openAddProduct = () => {
    if (!canManageProducts) {
      Swal.fire(
        "Access Denied",
        "You are not allowed to add products.",
        "error"
      );

      return;
    }

    resetForm();

    setShowModal(true);
  };

  const openBulkUpload = () => {
    if (!canManageProducts) {
      Swal.fire(
        "Access Denied",
        "You are not allowed to import products.",
        "error"
      );

      return;
    }

    setBulkFile(null);
    setBulkProgress(0);
    setShowBulkModal(true);
  };

  const closeBulkUpload = () => {
    setShowBulkModal(false);
    setBulkFile(null);
    setBulkProgress(0);
  };

  const handleBulkFileChange = (e) => {
    const selected = e.target.files?.[0] || null;
    setBulkFile(selected);
  };

  const handleBulkUpload = async () => {
    if (!canManageProducts) {
      Swal.fire(
        "Access Denied",
        "You are not allowed to import products.",
        "error"
      );
      return;
    }

    if (!bulkFile) {
      Swal.fire(
        "No File Selected",
        "Please choose a CSV or Excel file to upload.",
        "warning"
      );
      return;
    }

    try {
      setBulkLoading(true);
      setBulkProgress(0);

      const formData = new FormData();
      formData.append("file", bulkFile);

      // productService.js me bulkUploadProducts function expose hona chahiye,
      // jo (formData, onUploadProgress) accept kare, jaise:
      //
      // export const bulkUploadProducts = (formData, onProgress) =>
      //   api.post("/products/bulk-upload", formData, {
      //     headers: { "Content-Type": "multipart/form-data" },
      //     onUploadProgress: (evt) => {
      //       const percent = Math.round((evt.loaded * 100) / evt.total);
      //       onProgress?.(percent);
      //     },
      //   });
      await bulkUploadProducts(formData, (percent) => {
        setBulkProgress(percent);
      });

      await Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Products uploaded successfully.",
        timer: 2000,
        showConfirmButton: false,
      });

      closeBulkUpload();

      await loadProducts();
    } catch (error) {
      console.error("BULK UPLOAD ERROR:", error);

      Swal.fire({
        icon: "error",
        title: "Oops...",
        text:
          error?.response?.data?.message ||
          "Bulk upload failed. Please check your file and try again.",
      });
    } finally {
      setBulkLoading(false);
      setBulkProgress(0);
    }
  };

  const handleSubmit =
    async (e) => {
      e.preventDefault();

      if (!canManageProducts) {
        Swal.fire(
          "Access Denied",
          "You are not allowed to create products.",
          "error"
        );

        return;
      }

      try {
        const formData =
          buildFormData();

        console.log(
          "CREATING PRODUCT..."
        );

        await createProduct(
          formData
        );

        await Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Product added successfully.",
          timer: 2000,
          showConfirmButton: false,
        });

        setShowModal(false);

        resetForm();

        await loadProducts();
      } catch (error) {
        console.error(
          "CREATE PRODUCT ERROR:",
          error
        );

        Swal.fire({
          icon: "error",
          title: "Oops...",
          text:
            error?.response
              ?.data?.message ||
            "Product could not be added.",
        });
      }
    };


  const handleEdit = (
    product
  ) => {
    if (!canManageProducts) {
      Swal.fire(
        "Access Denied",
        "You are not allowed to edit products.",
        "error"
      );

      return;
    }

    setSelectedProduct(
      product
    );

    setForm({
      name:
        product.name || "",

      description:
        product.description || "",

      price:
        product.price || "",

      stock:
        product.stock || "",

      category:
        product.category || "",
        
      country:
        product.country || "",
      brand:
        product.brand || "",

      discount:
        product.discount || "",

      warranty:
        product.warranty || "",

      manufacturerInfo:
        product.manufacturerInfo ||
        "",

      highlights:
        Array.isArray(
          product.highlights
        )
          ? product.highlights.join(
              ", "
            )
          : "",

      specs: {
        ...EMPTY_SPECS,
        ...(product.specs || {}),
      },

      images: null,
    });

    setShowModal(true);
  };


  const handleUpdate =
    async (e) => {
      e.preventDefault();

      if (!canManageProducts) {
        Swal.fire(
          "Access Denied",
          "You are not allowed to update products.",
          "error"
        );

        return;
      }

      if (!selectedProduct?._id) {
        Swal.fire(
          "Error",
          "Product ID is missing.",
          "error"
        );

        return;
      }

      try {
        const formData =
          buildFormData();

        await updateProduct(
          selectedProduct._id,
          formData
        );

        await Swal.fire(
          "Success",
          "Product updated successfully.",
          "success"
        );

        setShowModal(false);

        resetForm();

        await loadProducts();
      } catch (error) {
        console.error(
          "UPDATE PRODUCT ERROR:",
          error
        );

        Swal.fire({
          icon: "error",
          title: "Error",
          text:
            error?.response
              ?.data?.message ||
            "Update failed.",
        });
      }
    };

  const handleDelete =
    async (product) => {
      if (!canManageProducts) {
        Swal.fire(
          "Access Denied",
          "You are not allowed to delete products.",
          "error"
        );

        return;
      }

      if (!product?._id) {
        Swal.fire(
          "Error",
          "Product ID is missing.",
          "error"
        );

        return;
      }

      const result =
        await Swal.fire({
          title:
            "Delete Product?",
          text: `Are you sure you want to delete "${product.name}"?`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonText:
            "Yes, Delete",
          cancelButtonText:
            "Cancel",
        });

      if (!result.isConfirmed) {
        return;
      }

      try {
        await deleteProduct(
          product._id
        );

        await Swal.fire(
          "Deleted",
          "Product deleted successfully.",
          "success"
        );

        await loadProducts();
      } catch (error) {
        console.error(
          "DELETE PRODUCT ERROR:",
          error
        );

        Swal.fire({
          icon: "error",
          title: "Error",
          text:
            error?.response
              ?.data?.message ||
            "Delete failed.",
        });
      }
    };

 
  const openProductModal = (
    product
  ) => {
    setSelectedProduct(
      product
    );

    setShowProductModal(true);
  };

  const handleBook = (
    id
  ) => {
    navigate(
      `/checkout/${id}`
    );
  };


  const goToPage = (
    page
  ) => {
    if (
      page < 1 ||
      page > totalPages
    ) {
      return;
    }

    setCurrentPage(page);
  };

  return (
    <div
      className="products-page"
      onClick={() =>
        sortOpen &&
        setSortOpen(false)
      }
    >
      <div className="products-header">
        <div className="header-left">
          <h1>Products</h1>
          <p> <span className="header-count"> {products.length}</span> {" "}total{" "}
            <span className={`header-role role-${role}`}> {role || "USER"}
            </span>
          </p>
        </div>
        {showProductModal && (
          <ProductModal
            product={
              selectedProduct
            }
            onClose={() => {
              setShowProductModal(
                false
              );
              setSelectedProduct(
                null
              );
            }}
          />
        )}

        {canManageProducts && (
          <div className="header-actions d-flex gap-2">
            <button
              type="button"
              className="btn-outline-action import"
              onClick={openBulkUpload}
            >
              <i className="bi bi-file-earmark-arrow-up"></i> Import
            </button>

            <button
              type="button"
              className="add-product-btn"
              onClick={
                openAddProduct
              }>
              <i className="bi bi-plus-lg"></i>Add Product
            </button>
          </div>
        )}
      </div>
      <div className="products-toolbar">
        <div className="toolbar-search">

          <i className="bi bi-search"></i>

          <input
            type="text"
            placeholder="Search products..."
            value={
              searchTerm
            }
            onChange={(e) =>
              setSearchTerm(
                e.target.value
              )
            }
          />

        </div>

        <div className="toolbar-right">
          <select
            className="toolbar-filter" value={ filterCategory }
            onChange={(e) => setFilterCategory( e.target.value)}>
            <option value="">
              All categories
            </option>
            {CATEGORIES.map(
              (category) => (
              <option key={category} value={ category }>
                  {category}
                </option>
              )
            )}
          </select>

         {/* SORT */}

      <div
            className="toolbar-sort"
            onClick={(e) => {
              e.stopPropagation();
               setSortOpen((value) =>!value);
               }} >
            <span className="sort-label">
              Sort By:{" "}
              <strong>
                { sortLabels[sortBy ] }
              </strong>
            </span>
            <i className={`bi bi-chevron-${ sortOpen ? "up": "down"}`} ></i>
            {sortOpen && (
              <div className="sort-dropdown">
                {Object.entries(
                  sortLabels
                ).map(
                  ([
                    key,
                    label,
                  ]) => (

                    <div
                      key={key}
                      className={`sort-option ${
                        sortBy ===
                        key
                          ? "active"
                          : ""
                      }`}
                      onClick={() => {
                        setSortBy(
                          key
                        );

                        setSortOpen(
                          false
                        );
                      }}
                    >
                      {label}
                    </div>

                  )
                )}

              </div>
            )}
          </div>
        </div>
      </div>
      {loading ? ( <Loader /> ) : (<>
          <div className="row g-4">

            {visibleProducts.length >
            0 ? (

              visibleProducts.map(
                (product) => (
                  <div
                    className="col-lg-3 col-md-6 col-sm-12"
                    key={
                      product._id
                    }
                  >

                    <div
                      className="product-card"
                      onClick={() => {
                        if (
                          !canManageProducts
                        ) {
                          openProductModal(
                            product
                          );
                        }
                      }}
                    >

                      {/* IMAGE */}

                      <div className="product-img">

                        <img
                          src={`http://localhost:5000/uploads/${product.images?.[0]}`}
                          alt={
                            product.name
                          }
                        />

                        {product.category && (
                          <span className="category-tag">
                            {
                              product.category
                            }
                          </span>
                        )}

                      </div>

                      {/* BODY */}

                      <div className="product-body">

                        <h5 className="product-name">
                          {
                            product.name
                          }
                        </h5>

                        <p className="product-desc">
                          {
                            product.description
                              ?.substring(
                                0,
                                80
                              )
                          }

                          {product.description &&
                          product.description.length >
                            80
                            ? "..."
                            : ""}
                        </p>

                       <h5 className="product-price"> {formatPrice( product.price,
                           product.currency )} </h5>

                      </div>

                      {/* FOOTER */}

                      <div className="product-footer">

                        {canManageProducts ? (

                          <div className="d-flex gap-2">

                            {/* EDIT */}

                            <button
                              type="button"
                              className="btn-outline-action edit"
                              onClick={(
                                e
                              ) => {
                                e.stopPropagation();

                                handleEdit(
                                  product
                                );
                              }}
                            >

                              <i className="bi bi-pencil"></i>

                              Edit

                            </button>

                            {/* DELETE */}

                            <button
                              type="button"
                              className="btn-outline-action delete"
                              onClick={(
                                e
                              ) => {
                                e.stopPropagation();

                                handleDelete(
                                  product
                                );
                              }}
                            >

                              <i className="bi bi-trash3"></i>

                              Delete

                            </button>

                          </div>

                        ) : (

                          <button
                            type="button"
                            className="btn-book"
                            onClick={(
                              e
                            ) => {
                              e.stopPropagation();

                              openProductModal(
                                product
                              );
                            }}
                          >

                            View Details

                          </button>

                        )}

                      </div>

                    </div>

                  </div>

                )
              )

            ) : (

              <div className="col-12">

                <div className="products-empty">

                  <i className="bi bi-box-seam"></i>

                  <p>
                    No products found
                  </p>

                </div>

              </div>

            )}

          </div>

          {/* ======================================
              PAGINATION
          ======================================= */}

          {totalPages > 1 && (

            <div className="pagination-bar">

              <button
                type="button"
                className="page-btn nav"
                disabled={
                  currentPage ===
                  1
                }
                onClick={() =>
                  goToPage(
                    currentPage -
                      1
                  )
                }
              >

                <i className="bi bi-chevron-left"></i>

                Prev

              </button>

              <div className="page-numbers">

                {[
                  ...Array(
                    totalPages
                  ),
                ].map(
                  (_, index) => {

                    const page =
                      index + 1;

                    return (
                      <button
                        type="button"
                        key={
                          page
                        }
                        className={`page-btn number ${
                          currentPage ===
                          page
                            ? "active"
                            : ""
                        }`}
                        onClick={() =>
                          goToPage(
                            page
                          )
                        }
                      >
                        {page}
                      </button>
                    );
                  }
                )}

              </div>

              <button
                type="button"
                className="page-btn nav"
                disabled={
                  currentPage ===
                  totalPages
                }
                onClick={() =>
                  goToPage(
                    currentPage +
                      1
                  )
                }
              >

                Next

                <i className="bi bi-chevron-right"></i>

              </button>

            </div>

          )}

        </>

      )}

      {/* ==========================================
          ADD / EDIT PRODUCT MODAL
      =========================================== */}

      {showModal &&
        canManageProducts && (

          <div className="product-modal-backdrop">

            <div className="product-modal">

              {/* MODAL HEADER */}

              <div className="modal-header-custom">

                <h5>
                  {
                    selectedProduct
                      ? "Update Product"
                      : "Add Product"
                  }
                </h5>

                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={() => {
                    setShowModal(
                      false
                    );

                    resetForm();
                  }}
                >

                  <i className="bi bi-x-lg"></i>

                </button>

              </div>

              {/* FORM */}

              <form
                onSubmit={
                  selectedProduct
                    ? handleUpdate
                    : handleSubmit
                }
              >

                <div className="modal-body-custom">

                  {/* =================================
                      BASIC INFO
                  ================================== */}

                  <div className="form-section">

                    <div className="form-section-title">

                      <i className="bi bi-box-seam"></i>

                      Basic Info

                    </div>

                    {/* NAME */}

                    <div className="form-group-custom">

                      <label>
                        Name
                      </label>

                      <input
                        type="text"
                        name="name"
                        value={
                          form.name
                        }
                        onChange={
                          handleChange
                        }
                        required
                      />

                    </div>

                    {/* STOCK + BRAND */}

                    <div className="form-row-custom">

                      <div className="form-group-custom">

                        <label>
                          Stock
                        </label>

                        <input
                          type="number"
                          name="stock"
                          value={
                            form.stock
                          }
                          onChange={
                            handleChange
                          }
                          min="0"
                          required
                        />

                      </div>

                      <div className="form-group-custom">

                        <label>
                          Brand
                        </label>

                        <input
                          type="text"
                          name="brand"
                          placeholder="e.g. Apple, Samsung"
                          value={
                            form.brand
                          }
                          onChange={
                            handleChange
                          }
                        />

                      </div>

                    </div>

                    {/* DESCRIPTION */}

                    <div className="form-group-custom">

                      <label>
                        Description
                      </label>

                      <textarea
                        name="description"
                        rows="3"
                        value={
                          form.description
                        }
                        onChange={
                          handleChange
                        }
                      />

                    </div>

                    {/* PRICE + DISCOUNT */}

                    <div className="form-row-custom">

                      <div className="form-group-custom">

                        <label>
                          Price
                        </label>

                        <input
                          type="number"
                          name="price"
                          value={
                            form.price
                          }
                          onChange={
                            handleChange
                          }
                          min="0"
                          required
                        />

                      </div>

                      <div className="form-group-custom">

                        <label>
                          Discount (%)
                        </label>

                        <input
                          type="number"
                          name="discount"
                          min="0"
                          max="100"
                          value={
                            form.discount
                          }
                          onChange={
                            handleChange
                          }
                        />

                      </div>

                    </div>

                    {/* CATEGORY */}
                <div className="form-row-custom">
                  <div className="form-group-custom">
                        <label> Category </label>
                        <select name="category"
                            value={ form.category }  onChange={  handleChange } required >
                            <option value="">  Select category </option>
                              {CATEGORIES.map( ( category ) => (
                                <option key={ category  }
                                  value={ category } > {  category }
                                </option>  ) )}
                        </select>
                  </div>

                  <div className="form-group-custom">
                      <label> Country</label>
                      <select name="country"value={form.country}onChange={handleChange}required>
                          <option value=""> Select Country </option>
                          <option value="India"> India </option> 
                          <option value="USA"> USA </option> 
                          <option value="UK">UK </option>
                          <option value="Canada"> Canada </option>
                          <option value="Australia"> Australia </option>
                          <option value="Germany"> Germany </option>
                      </select>
                   </div>
                   </div>
                    {/* IMAGE */}

                    <div className="form-group-custom">

                      <label>
                        Product Image
                      </label>

                      <input
                        type="file"
                        name="images"
                        accept="image/*"
                        onChange={
                          handleChange
                        }
                      />

                    </div>

                  </div>

                  {/* =================================
                      SHOWCASE
                  ================================== */}

                  <div className="form-section">

                    <div className="form-section-title">

                      <i className="bi bi-stars"></i>

                      Showcase Highlights

                    </div>

                    <div className="form-group-custom">

                      <label>
                        Highlights
                        (comma separated)
                      </label>

                      <textarea
                        name="highlights"
                        rows="2"
                        placeholder="e.g. A17 Pro chip, Titanium body, 48MP camera"
                        value={
                          form.highlights
                        }
                        onChange={
                          handleChange
                        }
                      />

                    </div>

                  </div>

                  {/* =================================
                      SPECIFICATIONS
                  ================================== */}

                  <div className="form-section">

                    <div className="form-section-title">

                      <i className="bi bi-cpu"></i>

                      Specifications

                    </div>

                    {/* RAM + STORAGE */}

                    <div className="form-row-custom">

                      <div className="form-group-custom">

                        <label>
                          RAM
                        </label>

                        <input
                          type="text"
                          name="ram"
                          value={
                            form.specs.ram
                          }
                          onChange={
                            handleSpecsChange
                          }
                        />

                      </div>

                      <div className="form-group-custom">

                        <label>
                          Storage
                        </label>

                        <input
                          type="text"
                          name="storage"
                          value={
                            form.specs.storage
                          }
                          onChange={
                            handleSpecsChange
                          }
                        />

                      </div>

                    </div>

                    {/* PROCESSOR + DISPLAY */}

                    <div className="form-row-custom">

                      <div className="form-group-custom">

                        <label>
                          Processor
                        </label>

                        <input
                          type="text"
                          name="processor"
                          value={
                            form.specs
                              .processor
                          }
                          onChange={
                            handleSpecsChange
                          }
                        />

                      </div>

                      <div className="form-group-custom">

                        <label>
                          Display
                        </label>

                        <input
                          type="text"
                          name="display"
                          value={
                            form.specs
                              .display
                          }
                          onChange={
                            handleSpecsChange
                          }
                        />

                      </div>

                    </div>

                    {/* REAR + FRONT CAMERA */}

                    <div className="form-row-custom">

                      <div className="form-group-custom">

                        <label>
                          Rear Camera
                        </label>

                        <input
                          type="text"
                          name="camera"
                          value={
                            form.specs
                              .camera
                          }
                          onChange={
                            handleSpecsChange
                          }
                        />

                      </div>

                      <div className="form-group-custom">

                        <label>
                          Front Camera
                        </label>

                        <input
                          type="text"
                          name="frontCamera"
                          value={
                            form.specs
                              .frontCamera
                          }
                          onChange={
                            handleSpecsChange
                          }
                        />

                      </div>

                    </div>

                    {/* BATTERY + COLOR */}

                    <div className="form-row-custom">

                      <div className="form-group-custom">

                        <label>
                          Battery
                        </label>

                        <input
                          type="text"
                          name="battery"
                          value={
                            form.specs
                              .battery
                          }
                          onChange={
                            handleSpecsChange
                          }
                        />

                      </div>

                      <div className="form-group-custom">

                        <label>
                          Color
                        </label>

                        <input
                          type="text"
                          name="color"
                          value={
                            form.specs
                              .color
                          }
                          onChange={
                            handleSpecsChange
                          }
                        />

                      </div>

                    </div>

                    {/* MODEL NO */}

                    <div className="form-group-custom">

                      <label>
                        Model No
                      </label>

                      <input
                        type="text"
                        name="modelNo"
                        value={
                          form.specs
                            .modelNo
                        }
                        onChange={
                          handleSpecsChange
                        }
                      />

                    </div>

                  </div>

                  {/* =================================
                      WARRANTY
                  ================================== */}

                  <div className="form-section">

                    <div className="form-section-title">

                      <i className="bi bi-shield-check"></i>

                      Warranty &
                      Manufacturer

                    </div>

                    {/* WARRANTY */}

                    <div className="form-group-custom">

                      <label>
                        Warranty
                      </label>

                      <input
                        type="text"
                        name="warranty"
                        placeholder="e.g. 1 Year Manufacturer Warranty"
                        value={
                          form.warranty
                        }
                        onChange={
                          handleChange
                        }
                      />

                    </div>

                    {/* MANUFACTURER */}

                    <div className="form-group-custom">

                      <label>
                        Manufacturer Info
                      </label>

                      <textarea
                        name="manufacturerInfo"
                        rows="2"
                        placeholder="e.g. Manufactured by Apple Inc, California, USA"
                        value={
                          form.manufacturerInfo
                        }
                        onChange={
                          handleChange
                        }
                      />

                    </div>

                  </div>

                </div>

                {/* =================================
                    MODAL FOOTER
                ================================== */}

                <div className="modal-footer-custom">

                  <button
                    type="button"
                    className="btn-outline-action cancel"
                    onClick={() => {
                      setShowModal(
                        false
                      );

                      resetForm();
                    }}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="add-product-btn"
                  >
                    {selectedProduct
                      ? "Update Product"
                      : "Save Product"}
                  </button>

                </div>

              </form>

            </div>

          </div>

        )}

      {/* ==========================================
          BULK UPLOAD MODAL
      =========================================== */}

      {canManageProducts && (
        <BulkUploadModal
          isOpen={showBulkModal}
          file={bulkFile}
          loading={bulkLoading}
          progress={bulkProgress}
          onFileChange={handleBulkFileChange}
          onUpload={handleBulkUpload}
          onClose={closeBulkUpload}
        />
      )}

    </div>
  );
}

export default Products;