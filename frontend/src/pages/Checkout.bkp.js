import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import API from "../api/axios";
import {
  bookProduct,
  checkoutOrder,
} from "../services/checkoutService";

import "./checkout.css";

const Checkout = () => {

  const { id } = useParams();
  const navigate = useNavigate();
  const [product,setProduct] = useState(null);
  const [step,setStep] = useState(1);
  const [quantity,setQuantity] = useState(1);
  const [loading,setLoading] = useState(false);
  const [paymentLoading,setPaymentLoading] = useState(false);
  const [address,setAddress] = useState({

    name:"",
    phone:"",
    city:"",
    state:"",
    pincode:"",
    fullAddress:""

  });
  const [paymentMethod,setPaymentMethod] = useState("upi");

  useEffect(()=>{
    const fetchProduct = async()=>{
      try{
        const res = await API.get(`/products/${id}`);
        setProduct(res.data.data);
      }catch(error){
        console.log(error);
      }
    };
    fetchProduct();
  },[id]);

  if(!product){

    return(
      <div className="checkout-loading">
        <div className="checkout-spinner"></div>
      </div>
    );
  }
  const discountPercent = product.discount || 0;
  const total =
    product.price * quantity;
  const discountAmount =
    (total * discountPercent)/100
  const finalTotal =
    total - discountAmount;
  const handlePayment = async()=>{
    try{
      setPaymentLoading(true);
      const orderResponse = await bookProduct({
        product_id:id,
        quantity,
        discount:discountPercent,
        total_price:finalTotal,
      });
      const orderId =
      orderResponse?.order?._id;
      if(!orderId){

        throw new Error(
          "Order creation failed"
        );

      }
      await checkoutOrder({
        order_id:orderId

      });
      await Swal.fire({

        icon:"success",

        title:"Order Confirmed",

        text:"Your order has been placed successfully",

        confirmButtonColor:"#2563eb"

      });
      navigate("/orders");
    }catch(error){
      console.log(error);
      Swal.fire({
        icon:"error",
        title:"Payment Failed",
        text:error.message || "Something went wrong"
      });
    }finally{
      setPaymentLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <div className="checkout-stepper">
        <div className={`step ${step >= 1 ? "active" : ""}`}>
          <span>1</span>
          <p>Address</p>
        </div>
        <div className={`line ${step >= 2 ? "active-line" : ""}`}></div>
        <div className={`step ${step >= 2 ? "active" : ""}`}>
          <span>2</span>
          <p>Order Summary</p>
        </div>
        <div className={`line ${step >= 3 ? "active-line" : ""}`}></div>
        <div className={`step ${step >= 3 ? "active" : ""}`}>
          <span>3</span>
          <p>Payment</p>
        </div>
      </div>

      <div className="checkout-container">
        <div className="checkout-left">
          {
            step === 1 && (
            <div className="checkout-box">
              <h2>
                Delivery Address
              </h2>
              <div className="form-grid">
                <input placeholder="Full Name" value={address.name}
                onChange={(e)=>
                  setAddress({
                    ...address,
                    name:e.target.value
                  })
                }/>
                <input placeholder="Phone Number" value={address.phone}
                onChange={(e)=>
                  setAddress({
                    ...address,
                    phone:e.target.value
                  })
                }/>
                <input placeholder="City  value={address.city}
                onChange={(e)=>
                  setAddress({
                    ...address,
                    city:e.target.value
                  })
                }/>
                <input placeholder="State" value={address.state}
                onChange={(e)=>
                  setAddress({
                    ...address,
                    state:e.target.value
                  })
                }
               
                />
                <input placeholder="Pincode" value={address.pincode}
                onChange={(e)=>
                  setAddress({
                    ...address,
                    pincode:e.targeta.value
                  })
                }/>
              </div>
              <textarea  placeholder="Full Address" value={address.fullAddress}
              onChange={(e)=> setAddress({ ...address,
                  fullAddress:e.target.value
                })
              } />
              <button className="continue-btn" onClick={()=>setStep(2)}>Continue</button>
            </div>
            )}
          {
            step === 2 && (
            <div className="checkout-box">
              <h2> Order Summary</h2>
              <div className="product-summary">
                <img src={`http://localhost:5000/uploads/${product.images?.[0]}`}
                  alt={product.name}/>
                <div>
                  <h3>
                    {product.name}
                  </h3>
                  <p>
                    Quantity : {quantity}
                  </p>
                  <div className="qty-box">
                    <button onClick={()=>{
                      if(quantity>1)
                      setQuantity(quantity-1)
                    }}> -
                    </button>
                    <span>
                      {quantity}
                    </span>
                    <button
                    onClick={()=>setQuantity(quantity+1)} > +
                    </button>
                  </div>
                </div>
              </div>

              <div className="address-preview">

                <h4>  Delivery Address </h4>
                <p> {address.name} </p>
                <p> {address.fullAddress}</p>
                <p> {address.city}, {address.state} - {address.pincode} </p>
              </div>
              <div className="button-row">
                <button
                   className="back-btn"
                   onClick={()=>setStep(1)}>Back</button>
                  <button
                  className="continue-btn"
                  onClick={()=>setStep(3)} >
                  Continue To Payment
                </button>
              </div>
            </div>
            )

          }

          {
            step === 3 && (
            <div className="checkout-box">
              <h2>
                Payment Method
              </h2>
              <div className="payment-methods">
                <button

                className={
                  paymentMethod==="upi"
                  ?
                  "method active"
                  :
                  "method"
                }


                onClick={()=>setPaymentMethod("upi")} >
                  <i className="bi bi-phone"></i>
                  UPI
                </button>
                <button
                className={
                  paymentMethod==="card"
                  ?
                  "method active"
                  :
                  "method"
                }
                onClick={()=>setPaymentMethod("card")}
                >
                  <i className="bi bi-credit-card"></i>

                  Card
                </button>
                <button

                className={
                  paymentMethod==="cod"
                  ?
                  "method active"
                  :
                  "method"
                }
                onClick={()=>setPaymentMethod("cod")}>
                  <i className="bi bi-cash"></i>
                  COD
                </button>
              </div>
              {
                paymentMethod==="upi" &&
                <input
                className="payment-input"
                placeholder="Enter UPI ID"
                />
              }
              {
                paymentMethod==="card" &&
                <>
                <inp
                className="payment-input"
                placeholder="Card Holder Name"/>
                <input className="payment-input" placeholder="Card Number"/>
                <div className="card-row">
                <input placeholder="Expiry"/>
                <input placeholder="CVV"/></div></>
              }
              <button
              className="pay-btn"
              onClick={handlePayment}
              disabled={paymentLoading}>
              {
                paymentLoading
                ?
                "Processing..."
                :
                `Pay ₹${finalTotal.toFixed(2)}`
              }
              </button>
            </div>
            )
          }
        </div>
        {/* ================= RIGHT PRICE CARD ================= */}
        <div className="price-card">
          <h3>
            Price Details
          </h3>
          <div>
            <span>
              Price
            </span>
            <span>
              ₹{total}
            </span>
          </div>
          <div>
            <span>
              Discount
            </span>
            <span className="discount">
              -₹{discountAmount.toFixed(2)}
            </span>
          </div>
          <div>
            <span>
              Delivery
            </span>
            <span className="green">
              Free
            </span>
          </div>
          <hr/>
          <div className="total-price">
            <span>
              Total
            </span>
            <span>
              ₹{finalTotal.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};


export default Checkout;