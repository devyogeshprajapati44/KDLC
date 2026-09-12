import React from "react";

function DeleteCategoryModal({
  show,
  onClose,
  onConfirm,
  items = [],
  loading,
}) {

  if (!show) return null;


  return (

    <div className="product-modal-backdrop">


      <div className="product-modal">



        <div className="modal-header-custom">


          <h5>
            Delete Category
          </h5>


          <button

            className="modal-close-btn"

            onClick={onClose}

          >

            <i className="bi bi-x-lg"></i>

          </button>


        </div>






        <div className="modal-body-custom">


          <div className="delete-warning">


            <i className="bi bi-exclamation-triangle-fill"></i>


            <p>

              Are you sure you want to delete the selected category?

            </p>



          </div>





          <div className="selected-category-list">


            {
              items.map((item)=>(

                <div

                  className="selected-category-item"

                  key={item.value}

                >

                  <i className="bi bi-tag"></i>

                  <span>
                    {item.name}
                  </span>


                </div>


              ))
            }



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

            className="btn-outline-action delete"

            onClick={onConfirm}

            disabled={loading}

          >

            {

              loading

              ? "Deleting..."

              : "Delete"

            }


          </button>



        </div>




      </div>


    </div>


  );

}


export default DeleteCategoryModal;