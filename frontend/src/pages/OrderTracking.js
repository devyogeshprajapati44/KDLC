import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getOrderTracking } from "../services/orderService";
import Loader from "../components/Loader";
import "./orderTracking.css";

const formatPrice = (amount, currency) => {
  const value = Number(amount || 0);

  let symbol = "$";

  if (currency?.symbol) {
    symbol = currency.symbol;
  } else if (currency?.code === "INR") {
    symbol = "₹";
  }

  return `${symbol}${value.toLocaleString("en-IN")}`;
};

const TRACKING_STEPS = [
  {
    status: "booked",
    title: "Order Booked",
    description: "Your order has been booked successfully",
    icon: "bi-cart-check-fill",
  },
  {
    status: "processing",
    title: "Processing",
    description: "Your order is being prepared",
    icon: "bi-box-seam-fill",
  },
  {
    status: "shipped",
    title: "Shipped",
    description: "Your order has been shipped",
    icon: "bi-truck",
  },
  {
    status: "delivered",
    title: "Delivered",
    description: "Your order has been delivered successfully",
    icon: "bi-house-check-fill",
  },
];

function OrderTracking() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTracking();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const fetchTracking = async () => {
    try {
      setLoading(true);

      const res = await getOrderTracking(orderId);

      // Backend response:
      // { success: true, data: {...} }
      setOrder(res.data || res.order);
    } catch (error) {
      console.error(
        "Tracking error:",
        error.response?.data || error.message
      );
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentStep = () => {
    if (!order) return -1;

    return TRACKING_STEPS.findIndex(
      (step) => step.status === order.status
    );
  };

  const currentStep = getCurrentStep();

  const getHistory = (status) => {
    return order?.trackingHistory?.find(
      (item) => item.status === status
    );
  };

  if (loading) {
    return <Loader />;
  }

  if (!order) {
    return (
      <div className="tracking-page">
        <div className="tracking-error-card">
          <div className="tracking-error-stamp">
            <i className="bi bi-exclamation-circle"></i>
          </div>
          <h2>Order Not Found</h2>
          <p>We could not find the tracking information for this waybill.</p>

          <button className="tracking-btn-primary" onClick={() => navigate("/orders")}>
            <i className="bi bi-arrow-left"></i>
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  const isCancelled = order.status === "cancelled";
  const orderIdShort = String(order._id || "").toUpperCase();

  return (
    <div className="tracking-page">
      <div className="tracking-container">

        {/* HEADER / WAYBILL STRIP */}
        <div className="tracking-header-card">
          <button
            className="tracking-back-btn"
            onClick={() => navigate("/orders")}
          >
            <i className="bi bi-arrow-left"></i>
            Back to Orders
          </button>

          <div className="tracking-header-content">
            <div className="tracking-header-main">
              <span className="tracking-eyebrow">
                <i className="bi bi-upc-scan"></i>
                Shipment Manifest
              </span>

              <h1>Track Your Order</h1>

              <div className="tracking-id-row">
                <span className="tracking-id-label">Order ID</span>
                <span className="tracking-id-value">#{orderIdShort}</span>
              </div>
            </div>

            <div
              className={`tracking-stamp tracking-stamp--${
                isCancelled ? "cancelled" : order.status
              }`}
            >
              <span className="tracking-stamp-text">
                {isCancelled ? "Cancelled" : order.status}
              </span>
            </div>
          </div>

          <div className="tracking-barcode" aria-hidden="true">
            {Array.from({ length: 46 }).map((_, i) => (
              <span key={i} className={i % 5 === 0 ? "bar bar--wide" : "bar"} />
            ))}
          </div>
        </div>

        {/* PRODUCT CARD */}
        <div className="tracking-product-card">
          <div className="tracking-product-image">
            {order.product?.images?.[0] ? (
              <img
                src={`http://localhost:5000/uploads/${order.product.images[0]}`}
                alt={order.product.name}
              />
            ) : (
              <i className="bi bi-box-seam"></i>
            )}
          </div>

          <div className="tracking-product-info">
            <span className="tracking-product-eyebrow">Contents</span>

            <h2>
              {order.product?.name || "Product"}
            </h2>

            <p className="tracking-product-qty">
              Qty <strong>{order.quantity || 1}</strong>
            </p>
          </div>

          <div className="tracking-product-price">
            <span className="tracking-product-eyebrow">Total</span>
            <h3>
              {formatPrice(
                order.total_price || 0,
                order.currency
              )}
            </h3>
          </div>
        </div>

        {/* CANCELLED */}
        {isCancelled ? (
          <div className="tracking-cancelled-card">
            <div className="cancelled-icon">
              <i className="bi bi-x-circle-fill"></i>
            </div>

            <div>
              <h2>Order Cancelled</h2>
              <p>
                This shipment has been cancelled and will not be delivered.
              </p>

              {getHistory("cancelled")?.updatedAt && (
                <small>
                  {new Date(
                    getHistory("cancelled").updatedAt
                  ).toLocaleString()}
                </small>
              )}
            </div>
          </div>
        ) : (

          /* TRACKING TIMELINE / ROUTE */
          <div className="tracking-timeline-card">
            <div className="tracking-timeline-header">
              <div>
                <span className="tracking-eyebrow">
                  <i className="bi bi-signpost-split"></i>
                  Order Journey
                </span>
                <h2>Route Progress</h2>
              </div>

              <span className="tracking-progress">
                Checkpoint {currentStep + 1} / {TRACKING_STEPS.length}
              </span>
            </div>

            <div className="tracking-route">
              {TRACKING_STEPS.map((step, index) => {
                const completed = index <= currentStep;
                const active = index === currentStep;
                const history = getHistory(step.status);

                return (
                  <div
                    className={`tracking-item ${
                      completed ? "completed" : ""
                    } ${active ? "active" : ""}`}
                    key={step.status}
                  >
                    <div className="tracking-step-left">
                      <div className="tracking-node">
                        {completed ? (
                          <i className="bi bi-check-lg"></i>
                        ) : (
                          <i className={`bi ${step.icon}`}></i>
                        )}
                      </div>

                      {index <
                        TRACKING_STEPS.length - 1 && (
                        <div className={`tracking-route-line ${completed ? "filled" : ""}`}></div>
                      )}
                    </div>

                    <div className="tracking-step-content">
                      <div className="tracking-step-heading">
                        <h3>{step.title}</h3>
                        {active && (
                          <span className="current-step-label">Current</span>
                        )}
                      </div>

                      <p>
                        {history?.message ||
                          step.description}
                      </p>

                      {history?.updatedAt && (
                        <small>
                          <i className="bi bi-clock"></i>
                          {new Date(
                            history.updatedAt
                          ).toLocaleString()}
                        </small>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* DELIVERY ADDRESS */}
        <div className="tracking-address-card">
          <div className="tracking-address-tab">
            <i className="bi bi-geo-alt-fill"></i>
            Deliver To
          </div>

          <div className="tracking-address-body">
            <h3>
              {order.shippingAddress?.name}
            </h3>

            <p>
              {order.shippingAddress?.address}
              {order.shippingAddress?.city &&
                `, ${order.shippingAddress.city}`}
              {order.shippingAddress?.state &&
                `, ${order.shippingAddress.state}`}
              {order.shippingAddress?.pincode &&
                ` - ${order.shippingAddress.pincode}`}
            </p>

            <small>
              <i className="bi bi-telephone-fill"></i>
              {order.shippingAddress?.phone}
            </small>
          </div>
        </div>

      </div>
    </div>
  );
}

export default OrderTracking;