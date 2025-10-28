import React from "react";

function Team() {
  return (
    <div className="container">
      {/* Section title */}
      <div className="row p-3 mt-5 border-top">
        <h1 className="text-center">People</h1>
      </div>

      {/* Team member */}
      <div
        className="row p-3 text-muted"
        style={{ lineHeight: "1.8", fontSize: "1.2em" }}
      >
        <div className="col-6 p-3 text-center">
          <img
            src="media/images/person.jpg"
            style={{ borderRadius: "100%", width: "50%" }}
            alt="Founder"
          />
          <h4 className="mt-5">Pruthvi</h4>
          <h6>Founder, CEO</h6>
        </div>
        <div className="col-6 p-3">
          <p>
            Pruthvi bootstrapped and founded StockTrading in 2010 to overcome the
            hurdles he faced during his decade-long stint as a trader. Today,
            StockTrading has changed the landscape of the Indian broking industry.
          </p>
          <p>
            He is a member of the SEBI Secondary Market Advisory Committee
            (SMAC) and the Market Data Advisory Committee (MDAC).
          </p>
          <p>Playing cricket is his zen.</p>
          <p>
            Connect on <a href="">Homepage</a> / <a href="">Community</a> /{" "}
            <a href="">Twitter</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Team;
