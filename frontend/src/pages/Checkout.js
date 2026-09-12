import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { bookProduct, checkoutOrder } from "../services/checkoutService";
import Swal from "sweetalert2";
import "./checkout.css";
import { formatPrice } from "../helpers/currency";




const Checkout = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [address, setAddress] = useState({
    name: "",
    phone: "",
    city: "",
    state: "",
    pincode: "",
    address: "",
  });
  const [payment, setPayment] = useState("UPI");

  useEffect(() => {
    fetchProduct();
  }, [id]);

const formatPrice = (price, currency) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency?.code || "INR",
  }).format(price);
};

  const decodeToken = (token) => {
  try {
    if (!token) return null;

    const parts = token.split(".");

    if (parts.length !== 3) {
      console.error("Invalid JWT token");
      return null;
    }

    const base64 = parts[1]
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "="
    );

    return JSON.parse(atob(padded));
  } catch (error) {
    console.error("JWT decode error:", error);
    return null;
  }
};

  const fetchProduct = async () => {
    try {
      const res = await API.get(`/products/${id}`);
      setProduct(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddressChange = (e) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value,
    });
  };

  const saveAddress = () => {
    if (!address.name || !address.phone || !address.address) {
      Swal.fire("Required", "Please fill delivery address", "warning");
      return;
    }
    setStep(2);
  };

  const createOrder = () => {
    setStep(3);
  };

  const makePayment = async () => {
    try {
      setLoading(true);
      const response = await bookProduct({
        product_id: id,
        quantity: 1,
        discount: product.discount || 0,
        shippingAddress: address,
      });
      const newOrderId = response.order._id;
      await checkoutOrder({
        order_id: newOrderId,
        payment: {
          method: payment,
          transactionId: "TXN" + Date.now(),
        },
         shippingAddress: address
      });
      await Swal.fire({
        icon: "success",
        title: "Order Confirmed",
        text: "Payment successful",
      });
      navigate("/orders");
    } catch (error) {
      console.log(error);
      Swal.fire("Payment Failed", "Try again", "error");
    } finally {
      setLoading(false);
    }
  };

  if (!product) {
    return <div className="checkout-loading">Loading...</div>;
  }

  const total =
    product.price -
    (product.price * (product.discount || 0)) / 100;

  const stepStatus = (n) =>
    step === n ? "active" : step > n ? "done" : "";

  return (
    <div className="checkout-page">
      <div className="checkout-shell">
        {/* LEFT RAIL — TICKET STUB */}
        <aside className="checkout-rail">
          <div className="rail-brand">Checkout</div>

          <ol className="ticket-steps">
            <li className={stepStatus(1)}>
              <span className="stub-index">{step > 1 ? "✓" : "01"}</span>
              <div className="stub-body">
                <span className="stub-label">Address</span>
                {step > 1 && address.name && (
                  <p className="stub-recap">
                    {address.name} · {address.city || "—"}
                  </p>
                )}
              </div>
            </li>
            <li className={stepStatus(2)}>
              <span className="stub-index">{step > 2 ? "✓" : "02"}</span>
              <div className="stub-body">
                <span className="stub-label">Order Summary</span>
                {step > 2 && (
                  <p className="stub-recap">{formatPrice(total, product.currency)} · {product.name}</p>
                )}
              </div>
            </li>
            <li className={stepStatus(3)}>
              <span className="stub-index">03</span>
              <div className="stub-body">
                <span className="stub-label">Payment</span>
              </div>
            </li>
          </ol>

          <div className="rail-total">
            <span className="rail-total-label">Amount payable</span>
            <span className="rail-total-value">{formatPrice(total, product.currency)}</span>
          </div>
        </aside>

        {/* RIGHT — ACTIVE PANEL */}
        <main className="checkout-card">
          <div className="card-perforation" aria-hidden="true"></div>

          {/* STEP 1 */}
          {step === 1 && (
            <div className="checkout-section">
              <h2>Delivery Address</h2>
              <input
                name="name"
                placeholder="Full Name"
                value={address.name}
                onChange={handleAddressChange}
              />
              <input
                name="phone"
                placeholder="Mobile Number"
                value={address.phone}
                onChange={handleAddressChange}
              />
              <div className="two-input">
                <input
                  name="city"
                  placeholder="City"
                  value={address.city}
                  onChange={handleAddressChange}
                />
                <input
                  name="state"
                  placeholder="State"
                  value={address.state}
                  onChange={handleAddressChange}
                />
              </div>
              <input
                name="pincode"
                placeholder="Pincode"
                value={address.pincode}
                onChange={handleAddressChange}
              />
              <textarea
                name="address"
                placeholder="Full Address"
                value={address.address}
                onChange={handleAddressChange}
              />
              <button className="checkout-btn" onClick={saveAddress}>
                Continue
              </button>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="checkout-section">
              <h2>Order Summary</h2>
              <div className="summary-product">
                <img
                  src={`http://localhost:5000/uploads/${product.images?.[0]}`}
                  alt="product"
                />
                <div>
                  <h3>{product.name}</h3>
                  <p> Price : {formatPrice(product.price, product.currency)}</p>
                  <p>Discount : {product.discount || 0}%</p>
                </div>
              </div>
              <div className="total-box">
                <h3>Delivery Address</h3>
                <p>{address.name}</p>
                <p>{address.phone}</p>
                <p>{address.address}</p>
                <hr />
                <h2>
                  <span>Total</span>
                  <span>{formatPrice(total, product.currency)}</span>
                </h2>
              </div>
              <button
                className="checkout-btn"
                onClick={createOrder}
                disabled={loading}
              >
                {loading ? "Creating Order..." : "Continue Payment"}
              </button>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="checkout-section">
              <h2>Payment</h2>
              <div className="payment-option">
                <label className={payment === "UPI" ? "selected-payment" : ""}>
                  <input
                    type="radio"
                    name="payment"
                    value="UPI"
                    checked={payment === "UPI"}
                    onChange={() => setPayment("UPI")}
                  />
                  <span>UPI</span>
                </label>
                <label className={payment === "CARD" ? "selected-payment" : ""}>
                  <input
                    type="radio"
                    name="payment"
                    value="CARD"
                    checked={payment === "CARD"}
                    onChange={() => setPayment("CARD")}
                  />
                  <span>Card</span>
                </label>
              </div>

              {payment === "UPI" && (
                <div className="payment-form">
                  <h3>UPI Payment</h3>
                  <input
                    type="text"
                    placeholder="Enter UPI ID"
                    className="payment-input"
                  />
                  <p className="payment-note">Example: yourname@upi</p>
                </div>
              )}

              {payment === "CARD" && (
                <div className="payment-form">
                  <h3>Card Payment</h3>
                  <input
                    type="text"
                    placeholder="Card Number"
                    className="payment-input"
                  />
                  <div className="card-row">
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="payment-input"
                    />
                    <input
                      type="password"
                      placeholder="CVV"
                      className="payment-input"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Card Holder Name"
                    className="payment-input"
                  />
                </div>
              )}

              <h3>Amount Payable</h3>
              <h1>{formatPrice(total, product.currency)}</h1>
              <div className="barcode" aria-hidden="true"></div>

              <button
                className="checkout-btn"
                onClick={makePayment}
                disabled={loading}
              >
                {loading ? "Processing..." : "Pay Now"}
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Checkout;
