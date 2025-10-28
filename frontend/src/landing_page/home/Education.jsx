import React from "react";

function Education() {
  return (
    <div className="container mt-5">
      <div className="row">
        {/* Illustration */}
        <div className="col-6">
          <img
            src="media/images/education.svg"
            style={{ width: "70%" }}
            alt="Education"
          />
        </div>

        {/* Text content */}
        <div className="col-6">
          <h1 className="mb-3 fs-2">Free and open market education</h1>
          <p>
            Varsity, StockTrading's online stock market education platform, covers everything 
            from the basics to advanced trading strategies.
          </p>
          <a href="" style={{ textDecoration: "none" }}>
            Varsity <i className="fa fa-long-arrow-right" aria-hidden="true"></i>
          </a>

          <p className="mt-5">
            Community Q&A, the most active trading and investment community in India, 
            answers all your market-related queries.
          </p>
          <a href="" style={{ textDecoration: "none" }}>
            Community Q&A <i className="fa fa-long-arrow-right" aria-hidden="true"></i>
          </a>
        </div>
      </div>
    </div>
  );
}

export default Education;
