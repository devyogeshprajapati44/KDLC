import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../pages/products.css";
import { formatPrice } from "../helpers/currency";

const API_URL = "http://localhost:5000/uploads";

const ProductModal = ({ product, onClose }) => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("showcase");
  const [activeImage, setActiveImage] = useState(0);

  const formatPrice = (price, currency) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency?.code || "INR",
  }).format(price);
};


  if (!product) return null;

  const images =
    product.images && product.images.length
      ? product.images
      : ["no-image.png"];

  const handleBookNow = () => {
    onClose();
    navigate(`/checkout/${product._id}`);
  };

  return (
    <div className="product-details-overlay" onClick={onClose}>
      <div
        className="product-details-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button className="modal-close-btn" onClick={onClose}>
          ✕
        </button>

        {/* Top */}
        <div className="product-details-top">

          {/* LEFT */}
          <div className="product-left">

            <div className="thumbnail-row">
              {images.map((img, index) => (
                <img
                  key={index}
                  src={`${API_URL}/${img}`}
                  alt=""
                  className={activeImage === index ? "active" : ""}
                  onClick={() => setActiveImage(index)}
                />
              ))}
            </div>

            <img
              className="product-main-image"
              src={`${API_URL}/${images[activeImage]}`}
              alt={product.name}
            />

          </div>

          {/* RIGHT */}
          <div className="product-right">

            <h2>{product.name}</h2>

            <div className="brand">
              Brand : <strong>{product.brand}</strong>
            </div>

            <div className="price">
                  {formatPrice(
                    product.finalPrice || product.price,
                    product.currency
                  )}

                  · {product.name}


              {product.discount > 0 && (
                <>
                  <span className="old-price">
                    ₹{product.price}
                  </span>

                  <span className="discount">
                    {product.discount}% OFF
                  </span>
                </>
              )}

            </div>

            <p>{product.description}</p>

            <div className="stock">
              {product.stock > 0 ? "In Stock" : "Out Of Stock"}
            </div>

            <div style={{ marginTop: 20 }}>
              ⭐ {product.rating || 4.5}
              <span style={{ color: "#777" }}>
                {" "}
                ({product.numReviews || 0} Reviews)
              </span>
            </div>

            <div className="pd-actions">

              <button
                className="btn-book-now"
                onClick={handleBookNow}
              >
                Book Now
              </button>

            </div>

          </div>

        </div>

        {/* Tabs */}

        <div className="product-tabs">

          <button
            className={activeTab === "showcase" ? "active" : ""}
            onClick={() => setActiveTab("showcase")}
          >
            Showcase
          </button>

          <button
            className={activeTab === "specs" ? "active" : ""}
            onClick={() => setActiveTab("specs")}
          >
            Specifications
          </button>

          <button
            className={activeTab === "warranty" ? "active" : ""}
            onClick={() => setActiveTab("warranty")}
          >
            Warranty
          </button>

          <button
            className={activeTab === "manufacturer" ? "active" : ""}
            onClick={() => setActiveTab("manufacturer")}
          >
            Manufacturer
          </button>

        </div>

        {/* Content */}

        <div className="tab-content">

          {activeTab === "showcase" && (

            <ul>

              {(product.highlights || []).map((item, index) => (
                <li key={index}>{item}</li>
              ))}

            </ul>

          )}

          {activeTab === "specs" && (

            <table className="spec-table">

              <tbody>

                {Object.entries(product.specs || {}).map(
                  ([key, value]) => (
                    <tr key={key}>
                      <td>
                        {key
                          .replace(/([A-Z])/g, " $1")
                          .replace(/^./, (c) => c.toUpperCase())}
                      </td>

                      <td>{value || "-"}</td>
                    </tr>
                  )
                )}

              </tbody>

            </table>

          )}

          {activeTab === "warranty" && (

            <div>

              <h4>Warranty</h4>

              <p>{product.warranty}</p>

            </div>

          )}

          {activeTab === "manufacturer" && (

            <div>

              <h4>Manufacturer Information</h4>

              <p>{product.manufacturerInfo}</p>

            </div>

          )}

        </div>

      </div>
    </div>
  );
};

export default ProductModal;