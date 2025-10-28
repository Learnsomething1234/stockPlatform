import React, { useEffect, useState } from "react";
import axios from "axios";
// Summary.jsx
import "../styles/summary.css";

import { ArrowUpward, ArrowDownward } from "@mui/icons-material"; 

const Summary = () => {
  const [user, setUser] = useState({});
  const [balance, setBalance] = useState(0);
  const [holdings, setHoldings] = useState({
    totalValue: 0,
    totalInvested: 0,
    profit: 0,
    percent: 0,
    count: 0,
  });

  const id = localStorage.getItem("userId");

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        
        const userRes = await axios.get(`https://stockplatform.onrender.com/user/${id}`);
        setUser(userRes.data);

        
        const balanceRes = await axios.get(`https://stockplatform.onrender.com/balance/${id}`);
        setBalance(balanceRes.data);

        
        const holdingsRes = await axios.get(`https://stockplatform.onrender.com/holdings/${id}`);
        if (holdingsRes.data?.stocks?.length) {
          const stocks = holdingsRes.data.stocks;

    
          const totalValue = stocks.reduce(
            (sum, s) => sum + (s.todayPrice || s.currentPrice || 0) * (s.qty || 0),
            0
          );
          const totalInvested = stocks.reduce((sum, s) => sum + (s.total || 0), 0);
          const profit = totalValue - totalInvested;
          const percent =
            totalInvested > 0 ? ((profit / totalInvested) * 100).toFixed(2) : 0;

          setHoldings({
            totalValue: totalValue.toFixed(2),
            totalInvested: totalInvested.toFixed(2),
            profit: profit.toFixed(2),
            percent,
            count: stocks.length,
          });
        } else {
          setHoldings({
            totalValue: 0,
            totalInvested: 0,
            profit: 0,
            percent: 0,
            count: 0,
          });
        }
      } catch (e) {
        console.error("Error fetching summary:", e);
      }
    };

    fetchSummary();
  }, [id]);

  const isProfit = parseFloat(holdings.profit) >= 0;

  return (
    <div className="summary-container">
      <div className="summary-card">
        <h3 className="summary-header">Hi, {user.name || "Trader"} 👋</h3>
        <hr />

        <section className="summary-section">
          <div className="summary-title">Equity</div>
          <div className="summary-row">
            <div className="summary-box">
              <h3>{balance.toLocaleString()} ₹</h3>
              <p>Margin available</p>
            </div>
            <div className="summary-divider"></div>
            <div className="summary-box">
              <p>Margins used: <span>0 ₹</span></p>
              <p>Opening balance: <span>{balance.toLocaleString()} ₹</span></p>
            </div>
          </div>
        </section>

        <hr />

        <section className="summary-section">
          <div className="summary-title">
            Holdings ({holdings.count || 0})
          </div>
          <div className="summary-row">
            <div className="summary-box">
              <h3 className={isProfit ? "profit" : "loss"}>
                {isProfit ? (
                  <ArrowUpward className="arrow-icon up" />
                ) : (
                  <ArrowDownward className="arrow-icon down" />
                )}
                {holdings.profit} ₹ <small>({holdings.percent}%)</small>
              </h3>
              <p>P&L</p>
            </div>
            <div className="summary-divider"></div>
            <div className="summary-box">
              <p>Current Value: <span>{holdings.totalValue} ₹</span></p>
              <p>Investment: <span>{holdings.totalInvested} ₹</span></p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Summary;