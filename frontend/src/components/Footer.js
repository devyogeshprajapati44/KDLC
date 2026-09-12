import React from "react";
import "./footer.css";

function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-inner">
        <span className="footer-brand">KDLC Innovation Pvt Ltd</span>
        <span className="footer-dot" />
        <span className="footer-text">
          © {new Date().getFullYear()} All rights reserved.
        </span>
      </div>
    </footer>
  );
}

export default Footer;