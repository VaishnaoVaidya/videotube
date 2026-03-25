import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const navigate = useNavigate();
  const host = "https://videotube-backend-5fg2.onrender.com";
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    const trimmedCredential = credential.trim();

    if (!trimmedCredential || !password.trim()) {
      setErrorMessage("Please enter your email or username and password.");
      setLoading(false);
      return;
    }

    const isEmail = trimmedCredential.includes("@");

    try {
      const response = await axios.post(
        `${host}/api/v1/users/login`,
        {
          ...(isEmail ? { email: trimmedCredential } : { username: trimmedCredential }),
          password,
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        localStorage.setItem("accessToken", response.data.data.accessToken);
        navigate("/");
      } else {
        setErrorMessage("Invalid login credentials.");
      }
    } catch (error) {
      const backendMessage = error?.response
        ? error?.response?.data?.message || "Invalid login credentials."
        : "Backend server is not reachable. Start the backend and try again.";
      setErrorMessage(backendMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <p className="page-intro__eyebrow">Welcome back</p>
        <h1 className="auth-card__title">Sign in to VideoTube</h1>
        <p className="auth-card__subtitle">
          Jump back into your feed, subscriptions, history, and creator tools.
        </p>

        <form className="form-stack" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="signin-email">Email or username</label>
            <input
              id="signin-email"
              type="text"
              value={credential}
              onChange={(e) => setCredential(e.target.value)}
              placeholder="Enter your email or username"
              maxLength={50}
            />
          </div>

          <div className="form-field">
            <label htmlFor="signin-password">Password</label>
            <input
              id="signin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              maxLength={50}
            />
          </div>

          {errorMessage ? (
            <p style={{ margin: 0, color: "#fb7185" }}>{errorMessage}</p>
          ) : null}

          <button className="auth-button" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Continue"}
          </button>
        </form>

        <p className="form-helper">
          Don&apos;t have an account? <span onClick={() => navigate("/signup")}>Create one</span>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
