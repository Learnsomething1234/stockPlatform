import React from "react";

function Universe() {
  return (
    <div className="container mt-5">
      <div className="row text-center">
        <h1>The StockTrading Universe</h1>
        <p>
          Extend your trading and investment experience even further with our
          partner platforms.
        </p>

        {/* Partner logos */}
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="col-4 p-3 mt-5">
            <img src="media/images/smallcaseLogo.png" alt="Partner logo" />
            <p className="text-small text-muted">Thematic investment platform</p>
          </div>
        ))}

        <button
          className="p-2 btn btn-primary fs-5 mb-5"
          style={{ width: "20%", margin: "0 auto" }}
        >
          Signup Now
        </button>
      </div>
    </div>
  );
}

export default Universe;
