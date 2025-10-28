import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Funds.css";

const Funds = () => {
  const userId = localStorage.getItem("userId");
  const [balance, setBalance] = useState(0);
  const [message, setMessage] = useState("");
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");

  useEffect(() => {
    fetchBalance();
    
  }, []);

  const fetchBalance = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/balance/${userId}`);
      const bal = typeof res.data === "number" ? res.data : res.data.newBalance ?? res.data;
      setBalance(Number(bal) || 0);
    } catch (err) {
      console.error("fetch balance error", err);
      setMessage("Unable to fetch balance");
    }
  };

  // const handleAddFunds = async () => {
  //   try {
  //     const res = await axios.post(`http://localhost:8080/addBalance/${userId}`);
  //     setMessage(res.data.message || "Added funds");
  //     await fetchBalance();
  //   } catch (err) {
  //     console.error("add funds err", err);
  //     setMessage(err.response?.data?.message || "Error adding funds");
  //   }
  // };

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
    try {
      const res = await axios.patch(`http://localhost:8080/withdraw/${userId}`, {
        amount: amt,
      });
      setMessage(res.data.message || "Withdraw successful");
      setShowWithdrawModal(false);
      fetchBalance();
    } catch (err) {
      console.error("withdraw err", err);
      setMessage(err.response?.data?.message || "Error withdrawing");
    }
  };

  return (
    <div className="funds-root">
      <div className="funds-top">
        <p className="funds-tag">Instant, zero-cost fund transfers with UPI</p>

        <div className="funds-actions">
          {/* <button className="btn btn-green" onClick={handleAddFunds}>
            + Add ₹2000
          </button> */}

          <button className="btn btn-blue" onClick={openWithdraw}>
            Withdraw
          </button>
        </div>
      </div>

      <div className="balance-card">
        <h3>Available Balance</h3>
        <p className="balance-amount">₹ {Number(balance).toLocaleString()}</p>
      </div>

      {message && <div className="message">{message}</div>}

    
      <div className="summary">
        <div className="data">
          <p>Available margin</p>
          <p className="imp colored">{(balance * 1.2).toFixed(2)}</p>
        </div>
        <div className="data">
          <p>Used margin</p>
          <p className="imp">{(balance * 0.8).toFixed(2)}</p>
        </div>
      </div>

     
      {showWithdrawModal && (
        <div className="modal-backdrop" onClick={closeWithdraw} role="presentation">
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()} 
          >
            <h4>Withdraw</h4>
            <input
              type="number"
              placeholder="Amount"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
            />
            <div className="modal-actions">
              <button className="btn btn-blue" onClick={handleWithdraw}>
                Confirm
              </button>
              <button className="btn btn-secondary" onClick={closeWithdraw}>
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