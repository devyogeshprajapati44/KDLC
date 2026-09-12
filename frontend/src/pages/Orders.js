import React, { useEffect, useState, useRef, useCallback,} from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { formatPrice } from "../helpers/currency";
import {updateOrderStatus,getAllOrders,getOrders,} from "../services/orderService";
import { getInvoice,deleteOrder, } from "../services/invoiceService";
import $ from "jquery";
import "datatables.net-dt/css/dataTables.dataTables.min.css";
import "datatables.net";
import Swal from "sweetalert2";
import "./orders.css";

import OrderTrackingModal from "../components/Ordertrackingmodal";


const STATUS_META = {
  booked: {
    label: "Booked",
    tone: "slate",
  },

  processing: {
    label: "Processing",
    tone: "amber",
  },

  shipped: {
    label: "Shipped",
    tone: "sky",
  },

  delivered: {
    label: "Delivered",
    tone: "emerald",
  },

  cancelled: {
    label: "Cancelled",
    tone: "rose",
  },
};
const decodeToken = (token) => {
  try {
    if (!token) {
      return null;
    }
    const parts = token.split(".");
    if (parts.length !== 3) {
      console.error("Invalid JWT token");
      return null;
    }
    const base64 = parts[1]
      .replace(/-/g, "+")
      .replace(/_/g, "/");
    const padded = base64.padEnd(
      base64.length +
        ((4 - (base64.length % 4)) % 4),
      "="
    );

    return JSON.parse(atob(padded));
  } catch (error) {
    console.error("JWT decode error:", error);
    return null;
  }
};

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [search, setSearch] = useState("");
  const tableRef = useRef(null);
  const token = localStorage.getItem("accessToken");
  const user = decodeToken(token);
  const role = user?.role?.toUpperCase();
  const [trackingOrderId, setTrackingOrderId] = useState(null);
  
  const navigate = useNavigate();
  const isAdmin =
    role === "SUPER_ADMIN" ||
    role === "ADMIN";

  const formatPrice = (price, currency) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency?.code || "INR",
  }).format(price);
};

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      let res;
      if (isAdmin) {
        console.log(
          "Loading ALL orders for:",
          role
        );

        res = await getAllOrders();
      }
      else {
        console.log(
          "Loading USER orders for:",
          role
        );

        res = await getOrders();
      }

      console.log(
        "Orders API response:",
        res
      );

      console.log(
        "FIRST ORDER:",
        res?.data?.[0]
      );

      setOrders(res?.data || []);
    } catch (err) {
      console.error(
        "Load orders error:",
        err.response?.data || err.message
      );

      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [isAdmin, role]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  useEffect(() => {
    if (!tableRef.current) {
      return;
    }

    if (
      $.fn.DataTable.isDataTable(
        tableRef.current
      )
    ) {
      $(tableRef.current)
        .DataTable()
        .destroy();
    }

    if (orders.length === 0) {
      return;
    }

    const timer = setTimeout(() => {
      if (!tableRef.current) {
        return;
      }

      $(tableRef.current).DataTable({
        pageLength: 10,
        responsive: true,
        autoWidth: false,
        destroy: true,
      });
    }, 0);

    return () => {
      clearTimeout(timer);
    };
  }, [orders]);
  const handleDownload = async (id) => {
    try {
      setDownloadingId(id);

      const blobData = await getInvoice(id);

      const pdfBlob = new Blob(
        [blobData],
        {
          type: "application/pdf",
        }
      );

      const url =
        window.URL.createObjectURL(
          pdfBlob
        );

      const link =
        document.createElement("a");

      link.href = url;

      link.download =
        `invoice-${id}.pdf`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(
        "DOWNLOAD ERROR:",
        err
      );

      Swal.fire(
        "Failed",
        "Invoice download failed.",
        "error"
      );
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDelete = async (id) => {
    const result =
      await Swal.fire({
        title: "Delete this order?",
        text: "This can't be undone.",
        icon: "warning",

        showCancelButton: true,

        confirmButtonColor:
          "#e0394a",

        cancelButtonColor:
          "#8890a4",

        confirmButtonText:
          "Delete",
      });

    if (!result.isConfirmed) {
      return;
    }

    try {
      await deleteOrder(id);

      setOrders((prev) =>
        prev.filter(
          (item) =>
            item._id !== id
        )
      );

      Swal.fire(
        "Deleted",
        "The order was removed.",
        "success"
      );
    } catch (error) {
      console.error(
        "Delete failed:",
        error
      );

      Swal.fire(
        "Failed",
        "Could not delete the order.",
        "error"
      );
    }
  };

  const filteredOrders =
    orders.filter(
      (order, index) => {
        const orderId =
          `ORD${String(
            index + 1
          ).padStart(3, "0")}`;

        const searchValue =
          search.toLowerCase();

        return (
          orderId
            .toLowerCase()
            .includes(searchValue) ||

          order.user_id?.name
            ?.toLowerCase()
            .includes(searchValue) ||

          order.product_id?.name
            ?.toLowerCase()
            .includes(searchValue)
        );
      }
    );
  const handleStatusChange = async (
    order,
    newStatus
  ) => {
    try {
      setUpdatingId(order._id);

      await updateOrderStatus(
        order._id,
        newStatus
      );

      setOrders((prev) =>
        prev.map((o) =>
          o._id === order._id
            ? {
                ...o,
                status: newStatus,
              }
            : o
        )
      );

      Swal.fire({
        icon: "success",
        title: "Status Updated",
        text: `Order status changed to ${newStatus}.`,
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error(
        "Status update error:",
        err
      );

      Swal.fire(
        "Failed",
        "Status update failed.",
        "error"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  
  return (
    <div className="orders-page">
      <div className="orders-banner">
        <div className="banner-left">
          <span className="banner-icon">
            <i className="bi bi-box-seam-fill"></i>
          </span>
          <div>
            <p className="banner-eyebrow">Fulfilment</p>
            <h2>Order manifest</h2>
          </div>
        </div>
        <div className="banner-right">
          <span className="banner-count"> {loading? "—" : orders.length} </span>
          <span className="banner-count-label">total orders</span>
        </div>
        <div className="banner-stamp">MANIFEST</div>
      </div>
      {trackingOrderId && (
          <OrderTrackingModal
            orderId={trackingOrderId}
            onClose={() => setTrackingOrderId(null)}
          />
        )}
      {loading ? (
        <Loader />
      ) : orders.length > 0 ? (
        <div className="orders-table-wrap">
          <table ref={tableRef} className="display orders-table w-100" >
            <thead>
              <tr>
                <th>Order ID</th>
                <th> Customer</th>
                <th>Product</th>
                <th>Qty</th>
                <th>Total</th>
                <th>Status</th>
                <th className="text-end">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(
                (order, index) => {
                  const meta =
                    STATUS_META[
                      order.status
                    ] || {
                      label:
                        order.status ||
                        "Unknown",
                      tone: "slate",
                    };
                  return (
                    <tr key={ order._id}>
                      <td className="cell-index">
                        {`ORD${String(index + 1).padStart(3, "0" )}`}
                      </td>
                      <td className="cell-strong">
                        {order.user_id ?.name || "N/A"}
                      </td>
                      <td className="muted">
                        {order.product_id ?.name ||"N/A"}
                      </td>
                      <td className="cell-mono">
                        {order.quantity ||0}
                      </td>
                      <td className="cell-price">
                        {formatPrice(
                          order.total_price || 0,
                          order.currency
                        )}
                       </td>
                      <td>
                        {isAdmin ? (
                          <div className={`status-select tone-${meta.tone}`} >
                            <span className="status-dot" aria-hidden="true" />
                            <select value={order.status }
                              disabled={ updatingId === order._id }
                              onChange={(e) =>
                                handleStatusChange(order,e.target.value)}>
                              {Object.entries( STATUS_META).map(
                                ([ value,m,]) => (
                                  <option key={value} value={value}>
                                    {m.label}
                                  </option>
                                )
                              )}
                            </select>
                          </div>
                          ) : (
                          <div className={`status-select tone-${meta.tone}`}>
                            <span className="status-dot" aria-hidden="true"/>
                            <span>{meta.label}</span>
                          </div>
                        )}
                      </td>
                      <td>
                        <div className="action-buttons">
                          {!isAdmin && (
                              <button
                                className="icon-btn track"
                                onClick={() => setTrackingOrderId(order._id)}
                                title="Track order"
                              >
                                <i className="bi bi-geo-alt-fill"></i>
                              </button>
                            )}
                          <button className="icon-btn danger"
                            onClick={() => handleDelete( order._id)}title="Delete order">
                            <i className="bi bi-trash3"></i>
                          </button>
                          <button className="icon-btn primary"
                            onClick={() => handleDownload( order._id)}
                            disabled={ downloadingId === order._id }title="Download invoice">
                            {downloadingId === order._id ? (
                              <span className="btn-spinner" />
                              ) : (
                              <i className="bi bi-file-earmark-arrow-down"></i>
                            )}
                          </button>
                          
                        </div>
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="orders-empty">
          <i className="bi bi-inbox"></i>
          <p> No orders yet</p>
          <span> New orders will show up here as they come in.</span>
        </div>
      )}
    </div>
  );
}

export default Orders;
