import React from "react";

function UpdateCategoriesModal({
  show,
  onClose,
  onSubmit,
  items = [],
  categoryList = [],
  handleCategoryFieldChange,
  loading,
}) {

  if (!show) return null;


  return (
    <div className="product-modal-backdrop">

      <div className="product-modal">


        <div className="modal-header-custom">

          <h5>Edit Category</h5>

          <button
            className="modal-close-btn"
            onClick={onClose}
          >
            <i className="bi bi-x-lg"></i>
          </button>

        </div>




        <div className="modal-body-custom">


          {
            items.map((item,index)=>(

              <div
                className="form-section"
                key={item.value}
              >


                <div className="form-group-custom">

                  <label>
                    Category Name
                  </label>


                  <input
                    type="text"
                    value={item.name}
                    onChange={(e)=>
                      handleCategoryFieldChange(
                        "name",
                        e.target.value,
                        index
                      )
                    }
                  />


                </div>





                <div className="form-group-custom">

                  <label>
                    Parent Category
                  </label>


                  <select

                    value={item.parentId || ""}

                    onChange={(e)=>
                      handleCategoryFieldChange(
                        "parentId",
                        e.target.value,
                        index
                      )
                    }

                  >

                    <option value="">
                      -- No Parent --
                    </option>


                    {
                      categoryList

                      .filter(
                        cat=>cat.value !== item.value
                      )

                      .map(cat=>(

                        <option
                          key={cat.value}
                          value={cat.value}
                        >
                          {cat.name}
                        </option>

                      ))
                    }


                  </select>


                </div>






                <div className="form-group-custom">

                  <label>
                    Type
                  </label>


                  <select

                    value={item.type || "product"}

                    onChange={(e)=>
                      handleCategoryFieldChange(
                        "type",
                        e.target.value,
                        index
                      )
                    }

                  >

                    <option value="product">
                      Product
                    </option>


                    <option value="service">
                      Service
                    </option>


                  </select>


                </div>



              </div>


            ))
          }



        </div>






        <div className="modal-footer-custom">


          <button

            className="btn-outline-action cancel"

            onClick={onClose}

          >

            Cancel

          </button>




          <button

            className="add-product-btn"

            onClick={onSubmit}

            disabled={loading}

          >

            {
              loading
              ? "Updating..."
              : "Update Category"
            }


          </button>



        </div>



      </div>


    </div>
  );
}


export default UpdateCategoriesModal;