import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

const Menu = () => {
  const location = useLocation();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [user1, setUser1] = useState("");
  const [us, setUs] = useState("");
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(token));

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`https://stocktrading-c41p.onrender.com/user/${userId}`);
        setUser1(response.data);
        setUs(response.data.name.charAt(0));
        setIsLoggedIn(true);
      } catch (e) {
        alert(e.message);
      }
    };

    if (userId) fetchUser();
  }, [userId]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
    setUser1("");
    setUs("");
    window.location.href = "/login";
  };

  const menuItems = [
    { name: "Dashboard", path: "/" },
    { name: "Orders", path: "/orders" },
    { name: "Holdings", path: "/holdings" },
    { name: "Positions", path: "/positions" },
    { name: "Funds", path: "/funds" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="menu-container">
      <img src="logo.png" alt="Logo" style={{ width: "50px" }} />
      <div className="menus">
        <ul>
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link to={item.path} style={{ textDecoration: "none" }}>
                <p className={isActive(item.path) ? "menu selected" : "menu"}>
                  {item.name}
                </p>
              </Link>
            </li>
          ))}
          {isLoggedIn && (
            <li>
              <p className="menu" style={{ cursor: "pointer" }} onClick={handleLogout}>
                Logout
              </p>
            </li>
          )}
        </ul>
        <hr />

        <div
          className="profile"
          onMouseEnter={() => setIsProfileDropdownOpen(true)}
          onMouseLeave={() => setIsProfileDropdownOpen(false)}
          style={{ position: "relative", cursor: "pointer" }}
        >
          <div className="avatar">{us}</div>
          <p className="username">KnownMore</p>

          {isProfileDropdownOpen && (
            <div
              className="profile-dropdown"
              style={{
                position: "absolute",
                top: "100%",
                right: 0,
                background: "#fff",
                border: "1px solid #ccc",
                borderRadius: "5px",
                padding: "10px",
                minWidth: "160px",
                boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
                zIndex: 10,
              }}
            >
              <p style={{ margin: "5px 0" }}>
                <strong>Name:</strong> {user1 ? user1.name : ""}
              </p>
              <p style={{ margin: "5px 0" }}>
                <strong>Username:</strong> {user1 ? user1.username : ""}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Menu;