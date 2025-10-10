
import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode"; // ✅ fixed import
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [showRegister, setShowRegister] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const [showResetLink, setShowResetLink] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  
  const [name, setName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);


  const [resetEmail, setResetEmail] = useState("");
  const [resetToken, setResetToken] = useState(""); // user pastes token manually
  const [newPassword, setNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);

  const API_URL = "http://localhost:5000/api/auth";


  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await axios.post(`${API_URL}/login`, {
        email: email.trim().toLowerCase(),
        password,
      });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      login(response.data.user);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed ❌");
    } finally {
      setLoading(false);
    }
  };


  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/;
    if (!passwordRegex.test(regPassword)) {
      setLoading(false);
      return setError(
        "Password must be at least 6 characters, include 1 uppercase letter, 1 number, and 1 special character."
      );
    }

    try {
      await axios.post(`${API_URL}/register`, {
        name,
        email: regEmail.trim().toLowerCase(),
        password: regPassword,
      });
      setMessage("Registration successful ✅ Please login now.");
      setShowRegister(false);
      setName("");
      setRegEmail("");
      setRegPassword("");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed ❌");
    } finally {
      setLoading(false);
    }
  };


  const handleForgotPassword = async () => {
    if (!email) return setError("Please enter your email first.");
    setError("");
    setMessage("");
    setLoading(true);

    try {
      await axios.post(`${API_URL}/forgot-password`, {
        email: email.trim().toLowerCase(),
      });
      setResetEmail(email); // store email for reset
      setShowResetLink(true);
      setMessage(
        "✅ Password reset link generated! Copy the token from terminal and paste below."
      );
    } catch (err) {
      setError(err.response?.data?.error || "Failed to generate reset link ❌");
    } finally {
      setLoading(false);
    }
  };


  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/;
    if (!passwordRegex.test(newPassword)) {
      setLoading(false);
      return setError(
        "Password must be at least 6 characters, include 1 uppercase letter, 1 number, and 1 special character."
      );
    }

    if (!resetToken) {
      setLoading(false);
      return setError("Please enter your reset token.");
    }

    try {
      await axios.post(`${API_URL}/reset-password/${resetToken}`, {
        password: newPassword,
      });
      setMessage("✅ Password reset successful! You can now login.");
      setShowResetForm(false);
      setShowResetLink(false);
      setNewPassword("");
      setResetToken("");
      setEmail("");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to reset password ❌");
    } finally {
      setLoading(false);
    }
  };

  
  const handleGoogleSuccess = (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      localStorage.setItem("token", credentialResponse.credential);
      localStorage.setItem("user", JSON.stringify(decoded));
      login(decoded);
      navigate("/");
    } catch {
      setError("Google login failed ❌");
    }
  };

 
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-900 dark:text-gray-100">
          {showRegister
            ? "Register"
            : showResetForm
            ? "Reset Password"
            : "Login"}
        </h2>

        {error && <div className="bg-red-500 text-white p-2 mb-4 rounded">{error}</div>}
        {message && <div className="bg-green-500 text-white p-2 mb-4 rounded">{message}</div>}

       
        {!showRegister && !showResetForm && (
          <form onSubmit={handleLogin} className="flex flex-col gap-3">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-2 border rounded dark:bg-gray-700 dark:text-white"
              required
              disabled={loading}
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="p-2 border rounded w-full dark:bg-gray-700 dark:text-white"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-2 text-gray-600 dark:text-gray-300"
              >
                {showPassword ? "👁️" : "🙈"}
              </button>
            </div>

            {showResetLink ? (
              <div className="text-sm text-gray-700 dark:text-gray-300">
                <p className="mb-2 text-green-600 font-medium">{message}</p>
                <button
                  type="button"
                  onClick={() => setShowResetForm(true)}
                  className="text-blue-600 hover:underline"
                >
                  Click here to reset your password
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-blue-600 dark:text-blue-400 text-left"
              >
                Forgot Password?
              </button>
            )}

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">
              Don’t have an account?{" "}
              <button
                onClick={() => setShowRegister(true)}
                className="text-blue-500 hover:underline"
              >
                Register
              </button>
            </p>
          </form>
        )}

        
        {showRegister && (
          <form onSubmit={handleRegister} className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="p-2 border rounded dark:bg-gray-700 dark:text-white"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
              className="p-2 border rounded dark:bg-gray-700 dark:text-white"
              required
            />
            <div className="relative">
              <input
                type={showRegPassword ? "text" : "password"}
                placeholder="Password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                className="p-2 border rounded w-full dark:bg-gray-700 dark:text-white"
                required
              />
              <button
                type="button"
                onClick={() => setShowRegPassword(!showRegPassword)}
                className="absolute right-2 top-2 text-gray-600 dark:text-gray-300"
              >
                {showRegPassword ? "👁️" : "🙈"}
              </button>
            </div>

            <p className="text-xs text-gray-500 mt-1">
              Password must be at least 6 characters, include 1 uppercase letter, 1 number, and 1 special character
            </p>

            <button
              type="submit"
              disabled={loading}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-green-300"
            >
              {loading ? "Registering..." : "Register"}
            </button>

            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">
              Already have an account?{" "}
              <button
                onClick={() => setShowRegister(false)}
                className="text-blue-500 hover:underline"
              >
                Login
              </button>
            </p>
          </form>
        )}

        
        {showResetForm && (
          <form onSubmit={handleResetPassword} className="flex flex-col gap-3">
            <input
              type="email"
              value={resetEmail}
              readOnly
              className="p-2 border rounded dark:bg-gray-700 dark:text-white"
            />
            <input
              type="text"
              placeholder="Paste reset token from terminal"
              value={resetToken}
              onChange={(e) => setResetToken(e.target.value)}
              className="p-2 border rounded dark:bg-gray-700 dark:text-white"
              required
            />
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="p-2 border rounded w-full dark:bg-gray-700 dark:text-white"
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-2 top-2 text-gray-600 dark:text-gray-300"
              >
                {showNewPassword ? "👁️" : "🙈"}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 disabled:bg-yellow-300"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>

            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">
              Remembered your password?{" "}
              <button
                onClick={() => {
                  setShowResetForm(false);
                  setShowResetLink(false);
                }}
                className="text-blue-500 hover:underline"
              >
                Login
              </button>
            </p>
          </form>
        )}

       
        {!showRegister && !showResetForm && (
          <>
            <div className="flex items-center my-4">
              <hr className="flex-1 border-gray-300 dark:border-gray-600" />
              <span className="px-2 text-gray-500 text-sm">OR</span>
              <hr className="flex-1 border-gray-300 dark:border-gray-600" />
            </div>

            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError("Google login failed ❌")}
            />
          </>
        )}
      </div>
    </div>
  );
}
