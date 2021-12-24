import React from "react";

export default function Welcome() {
  return (
    // Need to make buttons functional with marketplace
    <div className="container py-3">

      <div className="p-2 my-4 d-flex flex-row flex-wrap align-items-center text-center">
        <div
          className="input-group border border-secondary rounded p-1"
          style={{ width: 100 + "%" }}
        >
          <div className="input-group-prepend border-0">
            <button type="button" className="btn bg-transparent" style={{ color: "#6c757d" }}>
              <i className="bi bi-search"></i>
            </button>
          </div>
          <input
            type="search"
            placeholder="Search for players, teams, and games"
            aria-describedby="button-addon4"
            className="form-control bg-transparent border-0"
          />
        </div>
      </div>
    </div>
  );
}
