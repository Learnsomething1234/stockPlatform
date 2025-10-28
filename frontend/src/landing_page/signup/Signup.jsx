import React, { useState } from "react";
import axios from "axios";
import "./Signup.css"; // custom CSS

function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://stockplatform.onrender.com/signup", formData);
      setMessage(res.data.message);

      if (res.data.message === "User Register Succesfull") {
        window.location.replace("http://localhost:5174/login");
      }
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong, try again!");
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2>Create Account</h2>
        <p className="subtitle">Join us today and start your journey 🚀</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Sign Up</button>
        </form>
        {message && <p className="message">{message}</p>}
        <p className="login-text">
          Already have an account?{" "}
          <a href="http://localhost:5174/login">Login here</a>
        </p>
      </div>
    </div>
  );
}

export default Signup;
