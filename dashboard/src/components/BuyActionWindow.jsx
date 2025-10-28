// src/BuyActionWindow.js
import React, { useState, useContext, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import GeneralContext from "./GeneralContext";
import "./BuyActionWindow.css";

const BuyActionWindow = ({ uid }) => {
  const [quantity, setStockQuantity] = useState(1);
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const { closeBuyWindow } = useContext(GeneralContext);

  const windowRef = useRef(null);
  const offset = useRef({ x: 0, y: 0 });

  const onMouseDown = (e) => {
    const rect = windowRef.current.getBoundingClientRect();
    offset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const onMouseMove = (e) => {
    windowRef.current.style.left = `${e.clientX - offset.current.x}px`;
    windowRef.current.style.top = `${e.clientY - offset.current.y}px`;
  };

  const onMouseUp = () => {
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  };

  const handleBuyClick = async () => {
    if (!token || !userId) {
      alert("Login First");
      window.location.href = "/login";
      return;
    }

    try {
      const res = await axios.post(`https://stockplatform.onrender.com/buy/${userId}/${uid}`, {
        quantity: Number(quantity),
      });
      alert(res.data.message || `Bought ${quantity} shares`);
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    }

    closeBuyWindow();
  };

  return (
    <div className="buy-window-container" ref={windowRef}>
      <div className="buy-window-header" onMouseDown={onMouseDown}>
        <h3>Buy Order</h3>
        <button className="close-btn" onClick={closeBuyWindow}>✕</button>
      </div>

      <div className="regular-order">
        <fieldset>
          <legend>Qty</legend>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setStockQuantity(e.target.value)}
          />
        </fieldset>
      </div>

      <div className="buttons">
        <span>Margin required ₹140.65</span>
        <div>
          <Link className="btn btn-blue" onClick={handleBuyClick}>
            Buy
          </Link>
          <Link className="btn btn-grey" onClick={closeBuyWindow}>
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BuyActionWindow;
