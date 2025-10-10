
import React, { useState } from "react";
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState(""); 
  const [showReset, setShowReset] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const API_URL = "http://localhost:5000/api/auth";


  const handleForgotPassword = async () => {
    if (!email) return setError("Please enter your email first.");
    setError("");
    setMessage("");

    try {
      await axios.post(`${API_URL}/forgot-password`, {
        email: email.trim().toLowerCase(),
      });

      setMessage(
        <>
          ✅ Password reset link generated!{" "}
          <button
            className="text-blue-600 underline"
            onClick={() => setShowReset(true)}
          >
            Click here to reset your password
          </button>
        </>
      );

    } catch (err) {
      setError(err.response?.data?.error || "Failed to generate reset link ❌");
    }
  };


  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!resetToken) return setError("Please enter your reset token.");

    try {
      await axios.post(`${API_URL}/reset-password/${resetToken}`, {
        password: newPassword,
      });
      setMessage("✅ Password reset successful! You can now login.");
      setShowReset(false);
      setNewPassword("");
      setResetToken("");
    } catch (err) {
      setError(err.response?.data?.error || "Invalid or expired token ❌");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-900 dark:text-gray-100">
          Forgot Password
        </h2>

        {error && (
          <div className="bg-red-500 text-white p-2 mb-4 rounded">{error}</div>
        )}
        {message && (
          <div className="bg-green-500 text-white p-2 mb-4 rounded">{message}</div>
        )}

        {!showReset ? (
          <>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-2 border rounded w-full dark:bg-gray-700 dark:text-white"
            />
            <button
              onClick={handleForgotPassword}
              className="bg-blue-500 text-white px-4 py-2 mt-3 rounded w-full hover:bg-blue-600"
            >
              Request Reset Link
            </button>
            <p className="mt-3 text-sm text-center text-gray-600 dark:text-gray-300">
              Remembered your password?{" "}
              <a href="/login" className="text-blue-600 underline">
                Login
              </a>
            </p>
          </>
        ) : (
          <form
            onSubmit={handleResetPassword}
            className="flex flex-col gap-3 mt-4"
          >
            <input
              type="text"
              placeholder="Paste reset token"
              value={resetToken}
              onChange={(e) => setResetToken(e.target.value)}
              className="p-2 border rounded dark:bg-gray-700 dark:text-white"
              required
            />
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="p-2 border rounded dark:bg-gray-700 dark:text-white"
              required
            />
            <button
              type="submit"
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
            >
              Reset Password
            </button>
            <p className="mt-3 text-sm text-center text-gray-600 dark:text-gray-300">
              Remembered your password?{" "}
              <a href="/login" className="text-blue-600 underline">
                Login
              </a>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
