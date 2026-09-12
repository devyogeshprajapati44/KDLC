import React from "react";
import { useLocation } from "react-router-dom";
import "./navbar.css";

function Navbar() {
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user"));

  const initials = (user?.name || "?")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const getTitle = () => {
    if (location.pathname.startsWith("/dashboard")) return "Dashboard";
    if (location.pathname.startsWith("/products")) return "Products";
    if (location.pathname.startsWith("/orders")) return "Orders";
    if (location.pathname.startsWith("/users")) return "Users";
    if (location.pathname.startsWith("/orders")) return "Orders";
    return "Dashboard";
  };

  return (
    <header className="navbar-custom">

      <div>
        <h3>{getTitle()}</h3>
        <p>
          Welcome back, <strong>{user?.name}</strong>
        </p>
      </div>

      <div className="navbar-right">

        {/* Search */}

        <div className="search-box">
          <i className="bi bi-search"></i>

          <input
            type="text"
            placeholder="Search..."
          />
        </div>

        {/* Notification */}

        <div className="nav-icon">
          <i className="bi bi-bell"></i>

          <span className="badge-dot">2</span>
        </div>

        {/* Profile */}

        <div className="profile-box">

          <div className="profile-info">
            <h6>{user?.name}</h6>
            <span>{user?.role}</span>
          </div>

          <div className="profile-avatar">
            {initials}
          </div>

        </div>

      </div>

    </header>
  );
}

export default Navbar;