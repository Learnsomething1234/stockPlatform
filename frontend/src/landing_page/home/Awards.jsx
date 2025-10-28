import React from "react";

function Awards() {
  return (
    <div className="container mt-5">
      <div className="row">
        {/* Image / Illustration */}
        <div className="col-6 p-5">
          <img src="media/images/largestBroker.svg" alt="Largest Broker" />
        </div>

        {/* Text content */}
        <div className="col-6 p-5 mt-5">
          <h1>Largest stock broker in India</h1>
          <p className="mb-5">
            2+ million StockTrading clients contribute to a significant portion of
            retail order volumes in India daily by trading and investing in:
          </p>

          {/* List of instruments */}
          <div className="row">
            <div className="col-6">
              <ul>
                <li>
                  <p>Futures and Options</p>
                </li>
                <li>
                  <p>Commodity derivatives</p>
                </li>
                <li>
                  <p>Currency derivatives</p>
                </li>
              </ul>
            </div>
            <div className="col-6">
              <ul>
                <li>
                  <p>Stocks & IPOs</p>
                </li>
                <li>
                  <p>Direct mutual funds</p>
                </li>
                <li>
                  <p>Bonds and Govt. Securities</p>
                </li>
              </ul>
            </div>
          </div>

          {/* Press / logos */}
          <img
            src="media/images/pressLogos.png"
            style={{ width: "90%" }}
            alt="Press Logos"
          />
        </div>
      </div>
    </div>
  );
}

export default Awards;
