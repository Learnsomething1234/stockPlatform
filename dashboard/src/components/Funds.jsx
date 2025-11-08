import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Funds.css";
import { message1 } from "antd";

const Funds = () => {
  const userId = localStorage.getItem("userId");
  const [balance, setBalance] = useState(0);
  const [message, setMessage] = useState("");
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawHistory, setWithdrawHistory] = useState([]);
  const [transactionHistory, setTransactionHistory] = useState([]); 

  useEffect(() => {
    fetchBalance();
    fetchWithdrawHistory();
    fetchTransactionHistory(); 
  }, []);

  const fetchBalance = async () => {
    try {
      const res = await axios.get(`https://stockplatform.onrender.com/balance/${userId}`);
      const bal = res.data;
      setBalance(Number(bal) || 0);
    } catch (err) {
      console.error("fetch balance error", err);
      setMessage("Unable to fetch balance");
    }
  };

  const fetchWithdrawHistory = async () => {
    try {
      const res = await axios.get(`https://stockplatform.onrender.com/withdraw-history/${userId}`);
      setWithdrawHistory(res.data.withdrawHistory || []);
    } catch (err) {
      console.error("fetch withdraw history error", err);
      setWithdrawHistory([]);
    }
  };

  const fetchTransactionHistory = async () => {
    try {
      const res = await axios.get(`https://stockplatform.onrender.com/withdraw-history/${userId}`);
      console.log("transaction history response", res.data);
      setTransactionHistory(res.data.transactionHistory || []);
    } catch (err) {
      console.error("fetch transaction history error", err);
      setTransactionHistory([]);
    }
  };

  const openWithdraw = () => {
    setWithdrawAmount("");
    setShowWithdrawModal(true);
  };

  const closeWithdraw = () => setShowWithdrawModal(false);

  const handleWithdraw = async () => {
    const amt = Number(withdrawAmount);
    if (!amt || amt <= 0) {
      message1.warning("Enter a valid withdrawal amount");
      return;
    }
    if (amt > balance) {
      message1.warning("Insufficient balance");
      return;
    }
    try {
      const res = await axios.patch(`https://stockplatform.onrender.com/withdraw/${userId}`, {
        amount: amt,
      });
      setMessage(res.data.message || `₹${amt} withdrawn successfully`);
      message1.success(res.data.message || `₹${amt} withdrawn successfully`)
      setShowWithdrawModal(false);
      fetchBalance();
      fetchWithdrawHistory();
    } catch (err) {
      console.error("withdraw error", err);
      message1.error(err.response?.data?.message || "Error withdrawing")
      setMessage(err.response?.data?.message || "Error withdrawing");
    }
  };

  return (
    <div className="funds-container">
      <h2>Funds</h2>

      <div className="balance-card">
        <h3>Available Balance</h3>
        <p className="balance-amount">₹ {Number(balance).toLocaleString()}</p>
        <button className="withdraw-btn" onClick={openWithdraw}>
          Withdraw
        </button>
      </div>

     
      <div className="withdraw-history-card">
        <h4>Withdraw History</h4>
        {!withdrawHistory.length ? (
          <p>No withdraw history yet.</p>
        ) : (
          <table className="withdraw-history-table">
            <thead>
              <tr>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {withdrawHistory.map((w, idx) => (
                <tr key={idx}>
                  <td>₹ {w.amount}</td>
                  <td>{w.status}</td>
                  <td>{new Date(w.withdrawnAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="transaction-history-card">
        <h4>Transaction History</h4>
        {!transactionHistory.length ? (
          <p>No transaction history yet.</p>
        ) : (
          <table className="transaction-history-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Category</th>
                <th>Symbol</th>
                <th>Qty</th>
                <th>Buy Price</th>
                <th>Total</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {transactionHistory.map((t, idx) => (
                <tr key={idx}>
                  <td className={t.type === "BUY" ? "transaction-buy" : "transaction-sell"}>
                    {t.type === "BUY" ? "− Buy" : "+ Sell"}
                  </td>
                  <td>{t.category}</td>
                  <td>{t.symbol}</td>
                  <td>{t.qty}</td>
                  <td>₹ {t.buyPrice?.toFixed(2)}</td>
                  <td>₹ {t.total?.toFixed(2)}</td>
                  <td>{new Date(t.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {message && <p className="message">{message}</p>}

      {showWithdrawModal && (
        <div className="modal-overlay" onClick={closeWithdraw}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>Withdraw Funds</h3>
            <input
              type="number"
              placeholder="Enter amount"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
            />
            <div className="modal-buttons">
              <button className="confirm-btn" onClick={handleWithdraw}>
                Confirm
              </button>
              <button className="cancel-btn" onClick={closeWithdraw}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Funds;
