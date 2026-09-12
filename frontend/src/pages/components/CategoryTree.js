import React, { useState } from "react";


function CategoryTree({
  categories = [],
  selectedIds = [],
  onToggle,
}) {


  return (

    <div className="category-tree">

      {
        categories.map((category)=>(

          <CategoryNode

            key={category._id}

            category={category}

            selectedIds={selectedIds}

            onToggle={onToggle}

          />

        ))
      }


    </div>

  );

}





function CategoryNode({
  category,
  selectedIds,
  onToggle,
}) {


  const [open, setOpen] = useState(true);



  const hasChildren =
    category.children &&
    category.children.length > 0;



  return (

    <div className="category-node">



      <div className="category-row">



        {
          hasChildren && (

            <button

              className="tree-toggle"

              onClick={() =>
                setOpen(!open)
              }

            >

              {

                open

                ?

                <i className="bi bi-dash-square"></i>

                :

                <i className="bi bi-plus-square"></i>

              }


            </button>

          )
        }



        {
          !hasChildren && (

            <span className="tree-space"></span>

          )
        }






        <input

          type="checkbox"

          checked={
            selectedIds.includes(category._id)
          }

          onChange={() =>
            onToggle(category._id)
          }

        />





        <span className="category-name">

          {category.name}

        </span>





        {
          category.type && (

            <span className="category-type">

              {category.type}

            </span>

          )
        }



      </div>






      {
        hasChildren && open && (

          <div className="category-children">


            {
              category.children.map((child)=>(

                <CategoryNode

                  key={child._id}

                  category={child}

                  selectedIds={selectedIds}

                  onToggle={onToggle}

                />

              ))
            }


          </div>

        )
      }



    </div>

  );

}



export default CategoryTree;