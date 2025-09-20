import React, { useState } from "react";
import "./LoginSignup.css";
import { useNavigate } from "react-router-dom";

// ✅ Import Firebase auth and provider from firebase.js
import { auth, provider } from "./firebase"; 
import { signInWithPopup } from "firebase/auth";

function LoginSignup() {
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState(""); 
  const navigate = useNavigate();

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setMessage("");
  };

  const handleAuth = (e) => {
    e.preventDefault(); 
    if (isLogin) {
      setMessage("Logged in successfully!");
      setTimeout(() => navigate("/"), 1500);
    } else {
      setMessage("Account created successfully!");
      setTimeout(() => navigate("/"), 1500);
    }
  };

  // ✅ Google login
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      setMessage(`Welcome, ${user.displayName}!`);
      setTimeout(() => navigate("/"), 1500);
    } catch (error) {
      console.error("Google login error:", error);
      setMessage("Google login failed. Try again.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="logo">💊 MedCare</h2>
        <h3>{isLogin ? "Login to Your Account" : "Create a New Account"}</h3>

        <form>
          {!isLogin && (
            <>
              <input type="text" placeholder="Full Name" required />
              <input type="number" placeholder="Age" required />
              <select required>
                <option value="">Select Gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </>
          )}

          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />
          {!isLogin && <input type="password" placeholder="Confirm Password" required />}

          {isLogin && <a href="/forgot-password" className="forgot">Forgot Password?</a>}

          <button type="submit" className="auth-btn" onClick={handleAuth}>
            {isLogin ? "Login" : "Signup"}
          </button>
        </form>

        {message && <p className="success-message">{message}</p>}

        <p className="toggle-text">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span onClick={toggleForm} style={{ cursor: "pointer" }}>
            {isLogin ? "Signup" : "Login"}
          </span>
        </p>

        <div className="divider">OR</div>

        {/* ✅ Google login button */}
        <button className="google-btn" onClick={handleGoogleLogin}>
          Continue with Google
        </button>
      </div>
    </div>
  );
}

export default LoginSignup;
