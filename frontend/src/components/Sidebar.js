import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./sidebar.css";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  
  let user = null;

  try {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      user = JSON.parse(storedUser);
    }
  } catch (error) {
    console.error("Invalid user data:", error);
  }

  // ==========================================
  // ROLE
  // ==========================================

  const role = user?.role;

  console.log("SIDEBAR USER:", user);
  console.log("SIDEBAR ROLE:", role);

  // ADMIN + SUPER_ADMIN
  const canManageUsers =
    role === "ADMIN" ||
    role === "SUPER_ADMIN";

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    navigate("/");
  };

  const isActive = (path) =>
    location.pathname.startsWith(path)
      ? "active-menu"
      : "";

  const initials = (user?.name || "?")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const navItems = [
 
    {
      to: "/dashboard",
      icon: "bi-grid-fill",
      label: "Dashboard",
    },

    ...(canManageUsers
      ? [
          {
            to: "/users",
            icon: "bi-people-fill",
            label: "Users",
          },
          {
            to: "/category",
            icon: "bi-tags-fill",
            label: "Category",
          },
        ]
      : []),

    {
      to: "/products",
      icon: "bi-bag-fill",
      label: "Products",
    },

    {
      to: "/orders",
      icon: "bi-cart-check-fill",
      label: "Orders",
    },
  ];


  return (
    <aside className="sidebar">


      <div className="sidebar-top">

        <div className="logo">

           <div className="logo-icon">
              <img
                src="/images/logo/KDLC_Innovation_Logo.png"
                alt="KDLC Innovation"
              />
            </div>

          <div>
            <h4>KDLC Innovation</h4>
          </div>

        </div>

      </div>

      <ul className="menu">

        {navItems.map((item) => (

          <li key={item.to}>

            <Link
              to={item.to}
              className={`menu-link ${isActive(item.to)}`}
            >

              <i
                className={`bi ${item.icon}`}
              ></i>

              <span>
                {item.label}
              </span>

            </Link>

          </li>

        ))}

      </ul>
      <div className="sidebar-bottom">
        <div className="profile">

          <div className="avatar">
            {initials}
          </div>

          <div>

            <h6>
              {user?.name || "User"}
            </h6>

            <span>
              {user?.role || "USER"}
            </span>

          </div>

        </div>

        {/* LOGOUT */}

        <button
          className="logout-btn"
          onClick={logout}
        >

          <i className="bi bi-box-arrow-right"></i>

          Logout

        </button>

      </div>

    </aside>
  );
}

export default Sidebar;

