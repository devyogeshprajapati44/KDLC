import React, { useEffect, useState } from "react";
import { getOrderTracking } from "../services/orderService";
import "../pages/orderTracking.css";

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(20, 24, 36, 0.55)",
    backdropFilter: "blur(3px)",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    padding: "40px 16px",
    overflowY: "auto",
    zIndex: 1000,
  },
  modal: {
    position: "relative",
    width: "100%",
    maxWidth: "640px",
    background: "#f3ede0",
    borderRadius: "14px",
    boxShadow: "0 20px 60px -12px rgba(0, 0, 0, 0.45)",
    maxHeight: "calc(100vh - 80px)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
  body: {
    overflowY: "auto",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  closeBtn: {
    position: "absolute",
    top: "14px",
    right: "14px",
    zIndex: 2,
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    border: "none",
    background: "rgba(28, 35, 51, 0.9)",
    color: "#f3ede0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
    cursor: "pointer",
  },
  loadingWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "14px",
    padding: "60px 20px",
    color: "#7a7364",
    fontSize: "14px",
  },
};

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

function OrderTrackingModal({ orderId, onClose }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchTracking = async () => {
      try {
        setLoading(true);
        const res = await getOrderTracking(orderId);
        if (!cancelled) {
          setOrder(res.data || res.order);
        }
      } catch (error) {
        console.error(
          "Tracking error:",
          error.response?.data || error.message
        );
        if (!cancelled) {
          setOrder(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    if (orderId) {
      fetchTracking();
    }

    return () => {
      cancelled = true;
    };
  }, [orderId]);

  // close on Escape
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const getCurrentStep = () => {
    if (!order) return -1;
    return TRACKING_STEPS.findIndex((step) => step.status === order.status);
  };

  const currentStep = getCurrentStep();

  const getHistory = (status) => {
    return order?.trackingHistory?.find((item) => item.status === status);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const isCancelled = order?.status === "cancelled";

  return (
    <div style={styles.overlay} onClick={handleBackdropClick}>
      <div
        style={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-label="Order tracking"
      >
        <button style={styles.closeBtn} onClick={onClose} aria-label="Close">
          <i className="bi bi-x-lg"></i>
        </button>

        <div style={styles.body}>
          {loading ? (
            <div style={styles.loadingWrap}>
              <p>Loading tracking details…</p>
            </div>
          ) : !order ? (
            <div className="tracking-error-card" style={{ boxShadow: "none" }}>
              <div className="tracking-error-stamp">
                <i className="bi bi-exclamation-circle"></i>
              </div>
              <h2>Order Not Found</h2>
              <p>We could not find the tracking information for this waybill.</p>
              <button className="tracking-btn-primary" onClick={onClose}>
                Close
              </button>
            </div>
          ) : (
            <>
              {/* HEADER / WAYBILL STRIP */}
              <div className="tracking-header-card" style={{ boxShadow: "none" }}>
                <div className="tracking-header-content">
                  <div className="tracking-header-main">
                    <span className="tracking-eyebrow">
                      <i className="bi bi-upc-scan"></i>
                      Shipment Manifest
                    </span>
                    <h1>Track Your Order</h1>
                    <div className="tracking-id-row">
                      <span className="tracking-id-label">Order ID</span>
                      <span className="tracking-id-value">
                        #{String(order._id || "").toUpperCase()}
                      </span>
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
                    <span
                      key={i}
                      className={i % 5 === 0 ? "bar bar--wide" : "bar"}
                    />
                  ))}
                </div>
              </div>

              {/* PRODUCT CARD */}
              <div className="tracking-product-card" style={{ boxShadow: "none" }}>
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
                  <h2>{order.product?.name || "Product"}</h2>
                  <p className="tracking-product-qty">
                    Qty <strong>{order.quantity || 1}</strong>
                  </p>
                </div>

                <div className="tracking-product-price">
                  <span className="tracking-product-eyebrow">Total</span>
                  <h3>{formatPrice(order.total_price || 0, order.currency)}</h3>
                </div>
              </div>

              {isCancelled ? (
                <div className="tracking-cancelled-card" style={{ boxShadow: "none" }}>
                  <div className="cancelled-icon">
                    <i className="bi bi-x-circle-fill"></i>
                  </div>
                  <div>
                    <h2>Order Cancelled</h2>
                    <p>This shipment has been cancelled and will not be delivered.</p>
                    {getHistory("cancelled")?.updatedAt && (
                      <small>
                        {new Date(getHistory("cancelled").updatedAt).toLocaleString()}
                      </small>
                    )}
                  </div>
                </div>
              ) : (
                <div className="tracking-timeline-card" style={{ boxShadow: "none" }}>
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
                          className={`tracking-item ${completed ? "completed" : ""} ${
                            active ? "active" : ""
                          }`}
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
                            {index < TRACKING_STEPS.length - 1 && (
                              <div
                                className={`tracking-route-line ${
                                  completed ? "filled" : ""
                                }`}
                              ></div>
                            )}
                          </div>

                          <div className="tracking-step-content">
                            <div className="tracking-step-heading">
                              <h3>{step.title}</h3>
                              {active && (
                                <span className="current-step-label">Current</span>
                              )}
                            </div>
                            <p>{history?.message || step.description}</p>
                            {history?.updatedAt && (
                              <small>
                                <i className="bi bi-clock"></i>
                                {new Date(history.updatedAt).toLocaleString()}
                              </small>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="tracking-address-card" style={{ boxShadow: "none" }}>
                <div className="tracking-address-tab">
                  <i className="bi bi-geo-alt-fill"></i>
                  Deliver To
                </div>
                <div className="tracking-address-body">
                  <h3>{order.shippingAddress?.name}</h3>
                  <p>
                    {order.shippingAddress?.address}
                    {order.shippingAddress?.city && `, ${order.shippingAddress.city}`}
                    {order.shippingAddress?.state && `, ${order.shippingAddress.state}`}
                    {order.shippingAddress?.pincode && ` - ${order.shippingAddress.pincode}`}
                  </p>
                  <small>
                    <i className="bi bi-telephone-fill"></i>
                    {order.shippingAddress?.phone}
                  </small>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default OrderTrackingModal;