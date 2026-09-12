import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { checkoutOrder } from "../services/checkoutService";
import Swal from "sweetalert2";
import "./payment.css";
const Payment = () => {
   
   
const { id } = useParams();
const navigate = useNavigate();
const [order,setOrder] = useState(null);
const [loading,setLoading] = useState(true);
const [paying,setPaying] = useState(false);
const [method,setMethod] = useState("UPI");

useEffect(()=>{
fetchOrder();
},[id]);
const fetchOrder = async()=>{
try{
const res =
await API.get(`/orders/${id}`);
setOrder(
res.data.order
);
}catch(error){
console.log(error);
}finally{
setLoading(false);
}
};



const handlePayment = async () => {
  try {
    setPaying(true);

    await checkoutOrder({
      order_id: id,

      payment: {
        method: method,
        payment_status: "Paid",
        transactionId: "TXN" + Date.now()
      }
    });

    await Swal.fire({
      icon: "success",
      title: "Payment Successful",
      text: "Your order has been confirmed"
    });

    navigate("/orders");

  } catch (error) {
    console.log("Payment Error:", error.response?.data || error);

    Swal.fire({
      icon: "error",
      title: "Payment Failed",
      text: "Please try again"
    });

  } finally {
    setPaying(false);
  }
};

if(loading){
return (
<div className="payment-loading">
   Loading...
</div>
);
}
if(!order){
return (
<div className="payment-not-found">
   <h3>
      Order Not Found
   </h3>
</div>
);
}
return (
<div className="payment-page">
   <div className="payment-card">
      {/* LEFT SUMMARY */}
      <div className="payment-summary">
         <h2>
            Order Summary
         </h2>
         <div className="payment-product">
            <img
            src={
            `http://localhost:5000/uploads/${order.product_id?.images?.[0]}`
            }
            alt="product"
            />
            <div>
               <h3>
                  {order.product_id?.name}
               </h3>
               <p>
                  Quantity :
                  {order.quantity}
               </p>
               <p>
                  Price :
                  ₹{order.price}
               </p>
            </div>
         </div>
         <div className="payment-total">
            <div>
               <span>
               Discount
               </span>
               <b>
               {order.discount}%
               </b>
            </div>
            <div>
               <span>
               Total
               </span>
               <h2>
                  ₹{order.total_price}
               </h2>
            </div>
         </div>
      </div>
      {/* RIGHT PAYMENT */}
      <div className="payment-form-panel">
         <h2>
            Complete Payment
         </h2>
         <p>
            Select Payment Method
         </p>
         <div className="method-box">
            <button
            className={
            method==="UPI"
            ?
            "active-method"
            :
            ""
            }
            onClick={()=>setMethod("UPI")}
            >
            <i className="bi bi-phone"></i>
            UPI
            </button>
            <button
            className={
            method==="CARD"
            ?
            "active-method"
            :
            ""
            }
            onClick={()=>setMethod("CARD")}
            >
            <i className="bi bi-credit-card"></i>
            Card
            </button>
         </div>
         {
         method==="UPI" &&
         <div className="payment-input">
            <label>
            UPI ID
            </label>
            <input
               placeholder="example@upi"
               />
         </div>
         }
         {
         method==="CARD" &&
         <>
         <div className="payment-input">
            <label>
            Card Number
            </label>
            <input
               placeholder="XXXX XXXX XXXX XXXX"
               />
         </div>
         <div className="payment-row">
            <input
               placeholder="MM/YY"
               />
            <input
               placeholder="CVV"
               />
         </div>
         </>
         }
         <button
            className="pay-btn"
            disabled={paying}
            onClick={handlePayment}
            >
         {
         paying
         ?
         "Processing..."
         :
         `Pay ₹${order.total_price}`
         }
         </button>
         <div className="secure-payment">
            <i className="bi bi-shield-check"></i>
            Secure Payment Gateway
         </div>
      </div>
   </div>
</div>
);
};
export default Payment;