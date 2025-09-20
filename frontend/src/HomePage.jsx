import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

function HomePage() {
  // ✅ State for age and sex
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("");
  const navigate = useNavigate();

  // ✅ Function to navigate to symptom checker
  const handleContinue = () => {
    if (!age || !sex) {
      alert("Please enter your age and select your sex.");
      return;
    }
    navigate("/symptom-checker", { state: { age, sex } });
  };
  // ✅ Function to navigate to login page
const handleLogin = () => {
  navigate("/login"); // Make sure your login route is "/login"
};

const handleMedicine=()=>{
  navigate("/medicine/:name");
};
const handlePreventive=()=>{
  navigate("/preventive");
};

  return (
    <div className="homepage">
      {/* Navbar */}
      <nav className="navbar">
        <h2 className="logo">💊 MedCare</h2>
        <ul>
          <li>Home</li>
          <li>Symptom Checker</li>
          <li onClick={handleMedicine} style={{cursor:"pointer"}}>Medicine Info</li>
          <li onClick={handlePreventive} style={{cursor:"pointer"}}>Preventive Care</li>
          <li onClick={handleLogin} style={{ cursor: "pointer" }}>Login / Signup</li>
        </ul>
      </nav>

      {/* Hero Section */}
      <div className="hero">
        <h1 className="welcome-text">
          Welcome to HealthCare Recommendation System
        </h1>
        <p className="tagline">
          Your personal guide for medicines, remedies, preventive care
        </p>

        <form className="form-container">
          <label>Age:</label>
          <input
            type="number"
            placeholder="Enter your age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />

          <label>Sex:</label>
          <select
            value={sex}
            onChange={(e) => setSex(e.target.value)}
            required
          >
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          {/* Button remains the same */}
          <button type="button" onClick={handleContinue}>Continue</button>
        </form>

        {/* Scroll Down Arrow */}
        <div className="scroll-down">⬇</div>
      </div>

      {/* Why Choose Us Section */}
      <section className="why-us">
        <h2>Why Choose Us?</h2>
        <div className="features">
          <div className="feature-card">
            <span className="icon">🤖</span>
            <h3>AI Symptom Checker</h3>
            <p>Get instant suggestions based on your symptoms.</p>
          </div>
          <div className="feature-card">
            <span className="icon">💊</span>
            <h3>Medicine Info</h3>
            <p>Know dosage, usage & precautions of medicines.</p>
          </div>
          <div className="feature-card">
            <span className="icon">❤️</span>
            <h3>Preventive Care</h3>
            <p>Boost immunity with health tips & daily care routines.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2025 HealthCare. All rights reserved.</p>
        <div className="socials">
          <a href="#">Facebook</a>
          <a href="#">Twitter</a>
          <a href="#">LinkedIn</a>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;