import React from "react";
import { Link } from "react-router-dom"; // use if using react-router

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg border-bottom" style={{ backgroundColor: "#ffffff" }}>
      <div className="container p-2">
        {/* Logo */}
        <a className="navbar-brand" href="#">
          <img src="media/images/logo1.png" alt="Logo" style={{ width: "50%" }} />
          <h3>StockTrading</h3>
        </a>

        {/* Toggler */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar links */}
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link" href="/signup">Signup</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/about">About</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/product">Product</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/pricing">Pricing</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/support">Support</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
