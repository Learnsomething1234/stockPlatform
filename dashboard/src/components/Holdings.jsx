import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from "chart.js";
import axios from "axios";
import "./Holdings.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  ChartTooltip,
  Legend
);

const Holdings = () => {
  const [stocks, setStocks] = useState([]);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedStock, setSelectedStock] = useState(null);

  const fetchHoldings = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const res = await axios.get(`https://stockplatform.onrender.com/holdings/${userId}`);
      if (res.data.message) {
        setStocks([]);
      } else {
        setStocks(res.data.stocks || []);
        setBalance(res.data.balance || 0);
      }
    } catch (err) {
      console.error("Error fetching holdings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHoldings();
    const interval = setInterval(fetchHoldings, 5000); 
    return () => clearInterval(interval);
  }, []);

  const handleSell = async (stockId) => {
    try {
      const userId = localStorage.getItem("userId");
      const res = await axios.post(
        `https://stockplatform.onrender.com/sell-holding/${userId}/${stockId}`
      );
      alert(res.data.message);
      fetchHoldings();
      setSelectedStock(null);
    } catch (err) {
      console.error("Error selling stock:", err);
      alert("Sell failed");
    }
  };

  const handleAnalytics = (stock) => {
    // Ensure priceHistory exists
    if (!stock.priceHistory) {
      stock.priceHistory = [];
    }
    setSelectedStock(stock);
  };

  if (loading) return <p>Loading your holdings...</p>;
  if (!stocks.length) return <p>No holdings yet.</p>;

  const chartData = {
    labels: selectedStock?.priceHistory?.map((p) => p.date) || [],
    datasets: [
      {
        label: selectedStock?.symbol || "Stock Price",
        data: selectedStock?.priceHistory?.map((p) => p.price) || [],
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: {
        display: true,
        text: selectedStock ? `${selectedStock.symbol} Price History` : "",
      },
    },
  };

  return (
    <div className="holdings-container">
      <h2>Your Holdings</h2>
      <p>Balance: ₹{balance.toFixed(2)}</p>

      <div className="table-wrapper">
        <table className="holdings-table">
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Quantity</th>
              <th>Buy Price</th>
              <th>Today Price</th>
              <th>Total Value</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock) => {
              const isProfit = stock.todayPrice >= stock.currentPrice;
              return (
                <tr key={stock._id}>
                  <td>{stock.symbol}</td>
                  <td>{stock.qty}</td>
                  <td>₹{stock.currentPrice}</td>
                  <td className={isProfit ? "green" : "red"}>
                    ₹{stock.todayPrice}
                  </td>
                  <td>₹{(stock.qty * stock.todayPrice).toFixed(2)}</td>
                  <td>
                    <button
                      className="sell-btn"
                      onClick={() => handleSell(stock._id)}
                    >
                      Sell
                    </button>
                    <button
                      className="analytics-btn"
                      onClick={() => handleAnalytics(stock)}
                    >
                      Analytics
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {selectedStock && (
        <div className="analytics-chart">
          {selectedStock.priceHistory?.length ? (
            <Line data={chartData} options={chartOptions} />
          ) : (
            <p>No price history available for {selectedStock.symbol}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Holdings;
