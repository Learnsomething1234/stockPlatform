import React from "react";
import { Route, Routes } from "react-router-dom";

import Summary from "./Summary";
import Orders from "./Orders";
import Holdings from "./Holdings";
import Positions from "./Positions";
import Funds from "./Funds";
import WatchList from "./WatchList";
import Login from "./Login";
import PrivateRoute from "./PrivateRoute";
import { GeneralContextProvider } from "./GeneralContext";

import "../styles/dashboard.css";

const Dashboard = () => {
  return (
    <GeneralContextProvider>
      <div className="dashboard-container">
        <aside className="dashboard-left">
          <WatchList />
        </aside>

        <main className="dashboard-right">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Summary />
                </PrivateRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <PrivateRoute>
                  <Orders />
                </PrivateRoute>
              }
            />
            <Route
              path="/holdings"
              element={
                <PrivateRoute>
                  <Holdings />
                </PrivateRoute>
              }
            />
            <Route
              path="/positions"
              element={
                <PrivateRoute>
                  <Positions />
                </PrivateRoute>
              }
            />
            <Route
              path="/funds"
              element={
                <PrivateRoute>
                  <Funds />
                </PrivateRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </GeneralContextProvider>
  );
};

export default Dashboard;
