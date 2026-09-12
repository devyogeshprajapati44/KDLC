import React, { useEffect, useState, useCallback } from "react";
import API from "../api/axios";
import "./dashboard.css";
import Chart from "../components/Chart";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  const role = user?.role?.toUpperCase();

  const isAdmin =
    role === "SUPER_ADMIN" ||
    role === "ADMIN";

  const [counts, setCounts] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
  });

  const [userData, setUserData] = useState({
    totalOrders: 0,
    recentOrders: [],
  });

  const [loading, setLoading] = useState(true);

  const fetchCounts = useCallback(async () => {
    try {
      setLoading(true);

      const res = await API.get("/dashboard/counts");

      console.log("Dashboard Counts:", res.data);

      if (res.data?.data) {
        setCounts({
          totalUsers: res.data.data.totalUsers || 0,
          totalProducts: res.data.data.totalProducts || 0,
          totalOrders: res.data.data.totalOrders || 0,
        });
      }
    } catch (err) {
      console.error(
        "Dashboard counts error:",
        err.response?.data || err.message
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUserDashboard = useCallback(async () => {
    try {
      setLoading(true);

      const res = await API.get("/dashboard/user");

      console.log("User Dashboard:", res.data);

      if (res.data?.data) {
        setUserData({
          totalOrders: res.data.data.totalOrders || 0,
          recentOrders: res.data.data.recentOrders || [],
        });
      }
    } catch (err) {
      console.error(
        "User dashboard error:",
        err.response?.data || err.message
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log("Logged in user:", user);
    console.log("User role:", role);

    if (isAdmin) {
      fetchCounts();
    } else {
      fetchUserDashboard();
    }
  }, [isAdmin, role, fetchCounts, fetchUserDashboard]);

  const StatCard = ({
    title,
    value,
    icon,
    color,
    percentage,
    iconBg,
  }) => (
    <div className={`stat-card ${color}`}>
      <div className="card-top">
        <div
          className="icon-box"
          style={{ background: iconBg }}
        >
          <i className={`bi ${icon}`}></i>
        </div>

        <span className="growth">
          <i className="bi bi-graph-up-arrow"></i>
          {percentage}
        </span>
      </div>

      <div className="card-bottom">
        <h6>{title}</h6>

        <h2>
          {loading ? "..." : value}
        </h2>
      </div>
    </div>
  );

  return (
    <div className="dashboard-page">

      <div className="dashboard-title">
        <h2>
          Hi, Welcome back <span>👋</span>
        </h2>

        <p>
          {role === "SUPER_ADMIN"
            ? "Super Admin Dashboard"
            : role === "ADMIN"
            ? "Admin Dashboard"
            : "User Dashboard"}
        </p>
      </div>

      <div className="dashboard-grid">


        {isAdmin ? (
          <>
            <StatCard
              title="Total Users"
              value={counts.totalUsers}
              icon="bi-people-fill"
              color="blue-card"
              percentage="+2.6%"
              iconBg="#2563eb"
            />

            <StatCard
              title="Products"
              value={counts.totalProducts}
              icon="bi-bag-fill"
              color="purple-card"
              percentage="+3.1%"
              iconBg="#7c3aed"
            />

            <StatCard
              title="Orders"
              value={counts.totalOrders}
              icon="bi-cart-fill"
              color="yellow-card"
              percentage="+5.2%"
              iconBg="#f59e0b"
            />

            <StatCard
              title="Revenue"
              value={`₹${counts.totalOrders * 1000}`}
              icon="bi-currency-rupee"
              color="pink-card"
              percentage="+4.8%"
              iconBg="#ef4444"
            />
          </>
        ) : (
          <>
            <StatCard
              title="My Orders"
              value={userData.totalOrders}
              icon="bi-bag-check-fill"
              color="blue-card"
              percentage="+1.4%"
              iconBg="#2563eb"
            />

            <StatCard
              title="Completed"
              value={userData.recentOrders.length}
              icon="bi-check-circle-fill"
              color="purple-card"
              percentage="+2.2%"
              iconBg="#7c3aed"
            />

            <StatCard
              title="Pending"
              value={Math.max(
                0,
                userData.totalOrders -
                  userData.recentOrders.length
              )}
              icon="bi-clock-fill"
              color="yellow-card"
              percentage="+0.8%"
              iconBg="#f59e0b"
            />

            <StatCard
              title="Messages"
              value="12"
              icon="bi-envelope-fill"
              color="pink-card"
              percentage="+3.6%"
              iconBg="#ef4444"
            />
          </>
        )}

      </div>

      <Chart counts={counts} />

      <div className="dashboard-bottom">
        <div className="recent-orders">

          <div className="section-title">
            <h4>Recent Orders</h4>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : userData.recentOrders?.length > 0 ? (
            userData.recentOrders.map((order) => (
              <div
                className="order-item"
                key={order._id}
              >
                <div>
                  <h6>
                    {order.product_id?.name ||
                      order.product?.name ||
                      "Product"}
                  </h6>

                  <small>
                    {order.product_id?.category ||
                      order.product?.category ||
                      "Category"}
                  </small>
                </div>

                <strong>
                  ₹{order.price || 0}
                </strong>
              </div>
            ))
          ) : (
            <div className="empty-box">
              <i className="bi bi-box"></i>

              <p>No Recent Orders</p>
            </div>
          )}

        </div>
        <div className="activity-card">
          <h4>Quick Summary</h4>
          <div className="summary-row">
            <span>Total Products</span>

            <strong>
              {loading ? "..." : counts.totalProducts}
            </strong>
          </div>

          <div className="summary-row">
            <span>Total Orders</span>

            <strong>
              {loading ? "..." : counts.totalOrders}
            </strong>
          </div>

          <div className="summary-row">
            <span>Total Users</span>

            <strong>
              {loading ? "..." : counts.totalUsers}
            </strong>
          </div>

          <div className="summary-row">
            <span>Role</span>

            <strong>
              {role || "USER"}
            </strong>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;

