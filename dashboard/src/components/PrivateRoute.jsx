import React from "react";
import { Navigate } from "react-router-dom";
import { message } from "antd"; 

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    message.warning("You must log in first!"); 
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
