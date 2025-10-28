import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./StockAnalyticsModal.css";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

const StockAnalyticsModal = ({ stock, onClose }) => {
  if (!stock) return null;

  const labels = stock.previousPrices?.map((p) => {
    const date = new Date(p.recordedAt);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }) || [];

  const prices = stock.previousPrices?.map(p => p.price) || [];

  const data = {
    labels,
    datasets: [
      {
        label: `${stock.symbol} - Price Trend`,
        data: prices,
        fill: false,
        tension: 0.2,
        pointRadius: 5,
        // Color each point based on change
        pointBackgroundColor: prices.map((price, i) => {
          if (i === 0) return "gray";
          return price >= prices[i - 1] ? "green" : "red";
        }),
        // Dynamically color line segments
        borderColor: "green", // fallback
        segment: {
          borderColor: ctx => {
            const { p0, p1 } = ctx; // previous and current points
            return p1.parsed.y >= p0.parsed.y ? "green" : "red";
          }
        }
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: true, position: "top" },
      title: { display: true, text: `Price History for ${stock.symbol}` },
    },
    scales: {
      y: {
        ticks: { callback: value => `₹${value}` },
      },
    },
  };

  return (
    <div className="analytics-modal-overlay" onClick={onClose}>
      <div className="analytics-modal" onClick={(e) => e.stopPropagation()}>
        <h3>{stock.symbol} Analytics</h3>
        <Line data={data} options={options} />
        <button className="close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default StockAnalyticsModal;
