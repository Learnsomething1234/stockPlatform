import React, { useEffect, useState } from "react";
import axios from "axios";
import { Tooltip, Grow } from "@mui/material";
import { BarChartOutlined } from "@mui/icons-material";
import StockAnalyticsModal from "./StockAnalyticsModal";
import "./order.css";
import { message } from "antd";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [showBuyWindow, setShowBuyWindow] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const userId = localStorage.getItem("userId");

  const fetchOrders = async () => {
    try {
      const res = await axios.get("https://stockplatform.onrender.com/order");
      setOrders(res.data.stocks || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000); 
    return () => clearInterval(interval);
  }, []);

  const handleBuyClick = (stock) => {
    setSelectedStock(stock);
    setShowBuyWindow(true);
  };

  const handleConfirmBuy = async () => {
    if (!selectedStock) return;
    try {
      const res = await axios.post(
        `https://stockplatform.onrender.com/buy/${userId}/${selectedStock._id}`,
        { quantity: Number(quantity) }
      );
      if(res.data.success){
            message.success(res.data.success || `Bought ${quantity} shares`);
            }else{
              console.log(res.data.warning)
              message.warning(res.data.warning)
            }
    } catch (err) {
      console.error(err);
      alert("Buy failed");
    } finally {
      setShowBuyWindow(false);
      setSelectedStock(null);
      setQuantity(1);
    }
  };

  const handleCancel = () => {
    setShowBuyWindow(false);
    setSelectedStock(null);
    setQuantity(1);
  };

  return (
    <div className="orders-container">
      <h2>Orders</h2>

      {!orders.length ? (
        <p className="no-orders">Orders loading</p>
      ) : (
        <div className="orders-table-wrapper">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Day High</th>
                <th>Day Low</th>
                <th>Current Price</th>
                <th>Type</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((stock) => (
                <tr key={stock._id}>
                  <td>{stock.symbol}</td>
                  <td>₹{stock.dayHigh}</td>
                  <td>₹{stock.dayLow}</td>
                  <td>₹{stock.currentPrice}</td>
                  <td>{stock.type1}</td>
                  <td>
                    <button
                      className="buy-btn"
                      onClick={() => handleBuyClick(stock)}
                    >
                      Buy
                    </button>
                    <Tooltip
                      title="Analytics"
                      arrow
                      TransitionComponent={Grow}
                    >
                      <button
                        className="analytics-btn"
                        onClick={() => setShowAnalytics(stock)}
                      >
                        <BarChartOutlined />
                      </button>
                    </Tooltip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showBuyWindow && selectedStock && (
        <div className="buy-window-overlay">
          <div className="buy-window">
            <h3>Buy {selectedStock.symbol}</h3>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
            <div className="buy-window-buttons">
              <button className="confirm-btn" onClick={handleConfirmBuy}>
                Confirm
              </button>
              <button className="cancel-btn" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showAnalytics && (
        <StockAnalyticsModal
          stock={showAnalytics}
          onClose={() => setShowAnalytics(null)}
        />
      )}
    </div>
  );
};

export default Orders;
