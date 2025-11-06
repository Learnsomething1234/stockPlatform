import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Funds.css";

const Funds = () => {
  const userId = localStorage.getItem("userId");
  const [balance, setBalance] = useState(0);
  const [message, setMessage] = useState("");
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawHistory, setWithdrawHistory] = useState([]);

  useEffect(() => {
    fetchBalance();
    fetchWithdrawHistory();
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

  const openWithdraw = () => {
    setWithdrawAmount("");
    setShowWithdrawModal(true);
  };

  const closeWithdraw = () => setShowWithdrawModal(false);

  const handleWithdraw = async () => {
    const amt = Number(withdrawAmount);
    if (!amt || amt <= 0) {
      setMessage("Enter a valid withdrawal amount");
      return;
    }
    if (amt > balance) {
      setMessage("Insufficient balance");
      return;
    }
    try {
      const res = await axios.patch(`https://stockplatform.onrender.com/withdraw/${userId}`, {
        amount: amt,
      });
      setMessage(res.data.message || `₹${amt} withdrawn successfully`);
      setShowWithdrawModal(false);
      fetchBalance();
      fetchWithdrawHistory(); // refresh history after withdraw
    } catch (err) {
      console.error("withdraw error", err);
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

      {/* ✅ Withdraw History Section */}
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
