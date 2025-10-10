
import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function ResetPasswordUI() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // Step 1: request token, Step 2: reset password
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const API_URL = "http://localhost:5000/api/auth";


  const handleRequestToken = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      await axios.post(`${API_URL}/forgot-password`, { email: email.trim().toLowerCase() });
      setMessage("✅ Reset token sent! Check your email or server console.");
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to request reset token ❌");
    } finally {
      setLoading(false);
    }
  };


  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/;
    if (!passwordRegex.test(newPassword)) {
      return setError(
        "Password must be at least 6 characters, include 1 uppercase letter, 1 number, and 1 special character."
      );
    }

    if (!token) return setError("Please enter your reset token.");

    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/reset-password/${token}`, { password: newPassword });
      setMessage(res.data.message || "✅ Password reset successfully!");
      setStep(1);
      setEmail("");
      setToken("");
      setNewPassword("");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to reset password ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-900 dark:text-gray-100">
          {step === 1 ? "Forgot Password" : "Reset Password"}
        </h2>

        {error && <div className="bg-red-500 text-white p-2 mb-4 rounded">{error}</div>}
        {message && <div className="bg-green-500 text-white p-2 mb-4 rounded">{message}</div>}

        {step === 1 && (
          <form onSubmit={handleRequestToken} className="flex flex-col gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-2 border rounded dark:bg-gray-700 dark:text-white"
              required
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
            >
              {loading ? "Sending..." : "Send Reset Token"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleResetPassword} className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Enter reset token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="p-2 border rounded dark:bg-gray-700 dark:text-white"
              required
              disabled={loading}
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
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
            <p className="text-xs text-gray-500 mt-1">
              Password must be at least 6 characters, include 1 uppercase letter, 1 number, and 1 special character.
            </p>
            <button
              type="submit"
              disabled={loading}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-green-300"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

        <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 text-center">
          Remembered your password?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
