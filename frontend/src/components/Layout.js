import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "./layout.css";

function Layout({ children }) {
  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className="sidebar-area">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <div className="main-area">
        {/* Top Navbar */}
        <Navbar />

        {/* Page Content */}
        <main className="content-area">
          {children}
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}

export default Layout;