import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Positions.css";

const Positions = () => {
  const [stocks, setStocks] = useState([]);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const res = await axios.get(`http://localhost:8080/positions/${userId}`);

        setStocks(res.data.stocks || []);
        setBalance(res.data.balance || 0);
      } catch (err) {
        console.error("Error fetching positions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPositions();
  }, []);

  if (loading) return <p>Loading your positions...</p>;
  if (!stocks.length) return <p>No positions yet.</p>;

  return (
    <div className="positions-container">
      <h2>Your Positions</h2>
      <p>Balance: ₹{balance.toFixed(2)}</p>
      <div className="table-wrapper">
        <table className="positions-table">
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Quantity</th>
              <th>Buy Price</th>
              <th>Total Value</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock) => (
              <tr key={stock._id}>
                <td>{stock.symbol}</td>
                <td>{stock.qty}</td>
                <td>₹{stock.currentPrice}</td>
                <td>₹{(stock.qty * stock.currentPrice).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Positions;