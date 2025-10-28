import React from "react";
import Menu from "./Menu";
import "./Topbar.css";

const TopBar = () => {
  return (
    <div className="topbar-container">
     
      <div className="left-section">
        <div className="indices">
          <p className="index">NIFTY 50: <span className="index-points">100.2</span></p>
          <p className="index">SENSEX: <span className="index-points">100.2</span></p>
        </div>
        <div className="watchlist">Watchlist</div>
      </div>

      
      <Menu />
    </div>
  );
};

export default TopBar;
