import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../config/api";

const SignUp = () => {
  const navigate = useNavigate();
  const host = BASE_URL;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim();

    if (!trimmedUsername || !trimmedEmail || !password.trim()) {
      setErrorMessage("Please fill in username, email, and password.");
      return;
    }

    try {
      setLoading(true);
      await axios.post(`${host}/api/v1/users/signup`, {
        email: trimmedEmail,
        password,
        username: trimmedUsername,
      });
      navigate("/signin");
    } catch (error) {
      const backendMessage = error?.response
        ? error?.response?.data?.message ||
          error?.response?.data?.errors?.[0]?.message ||
          "Unable to create account right now."
        : "Backend server is not reachable. Start the backend and try again.";
      setErrorMessage(backendMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page px-4 sm:px-6 lg:px-8">
      <div className="auth-card w-full max-w-xl">
        <p className="page-intro__eyebrow">Join the platform</p>
        <h1 className="auth-card__title">Create your creator account</h1>
        <p className="auth-card__subtitle">
          Build your channel, upload videos, and curate your own streaming space.
        </p>

        <form className="form-stack" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="signup-username">Username</label>
            <input
              id="signup-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Pick a username"
              maxLength={50}
            />
          </div>

          <div className="form-field">
            <label htmlFor="signup-email">Email</label>
            <input
              id="signup-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              maxLength={50}
            />
          </div>

          <div className="form-field">
            <label htmlFor="signup-password">Password</label>
            <input
              id="signup-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              maxLength={50}
            />
          </div>

          {errorMessage ? <p className="m-0 text-sm text-rose-400">{errorMessage}</p> : null}

          <button className="auth-button" type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="form-helper">
          Already have an account? <span onClick={() => navigate("/signin")}>Sign in</span>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
