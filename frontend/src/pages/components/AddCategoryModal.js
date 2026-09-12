import React, { useEffect, useState } from "react";

function AddCategoryModal({
  show,
  onClose,
  onSubmit,
  categoryName,
  setCategoryName,
  parentCategoryId,
  setParentCategoryId,
  categoryList = [],
  categoryImage,
  handleCategoryImage,
  loading,
}) {

  const [preview, setPreview] = useState(null);


  useEffect(() => {

    if (!categoryImage) {
      setPreview(null);
      return;
    }


    const url = URL.createObjectURL(categoryImage);

    setPreview(url);


    return () => {
      URL.revokeObjectURL(url);
    };


  }, [categoryImage]);



  if (!show) return null;



  return (

    <div className="product-modal-backdrop">


      <div className="product-modal">



        <div className="modal-header-custom">

          <h5>
            Add New Category
          </h5>


          <button

            className="modal-close-btn"

            onClick={onClose}

          >

            <i className="bi bi-x-lg"></i>

          </button>


        </div>






        <div className="modal-body-custom">


          <div className="form-section">





            <div className="form-group-custom">

              <label>
                Category Name
              </label>


              <input

                type="text"

                placeholder="Enter category name"

                value={categoryName}

                onChange={(e)=>
                  setCategoryName(e.target.value)
                }

              />


            </div>







            <div className="form-group-custom">


              <label>
                Parent Category
              </label>



              <select

                value={parentCategoryId}

                onChange={(e)=>
                  setParentCategoryId(e.target.value)
                }

              >


                <option value="">
                  -- No Parent (Top Level) --
                </option>



                {
                  categoryList.map((cat)=>(

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
                Category Image
              </label>




              <label

                htmlFor="categoryImage"

                className="cat-upload"

              >


                {
                  preview ?

                  (

                    <img

                      src={preview}

                      alt="preview"

                      className="cat-upload-preview"

                    />

                  )

                  :

                  (

                    <div className="cat-upload-placeholder">


                      <i className="bi bi-cloud-upload"></i>


                      <span>
                        Click to upload image
                      </span>


                    </div>

                  )

                }



              </label>





              <input

                id="categoryImage"

                type="file"

                accept="image/*"

                hidden

                onChange={handleCategoryImage}

              />




            </div>




          </div>


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

              ? "Saving..."

              : "Save Category"

            }


          </button>




        </div>





      </div>



    </div>


  );

}


export default AddCategoryModal;