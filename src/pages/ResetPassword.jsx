import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function ResetPassword() {
  const { token } = useParams(); // Get token from URL
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const API_URL = "http://localhost:5000/api/auth";

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

    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/reset-password/${token}`, {
        password: newPassword,
      });
      setMessage(res.data.message || "✅ Password reset successfully!");
      setNewPassword(""); // Clear input
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
          Reset Password
        </h2>

        {error && <div className="bg-red-500 text-white p-2 mb-4 rounded">{error}</div>}
        {message && <div className="bg-green-500 text-white p-2 mb-4 rounded">{message}</div>}

        <form onSubmit={handleResetPassword} className="flex flex-col gap-3">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="p-2 border rounded w-full dark:bg-gray-700 dark:text-white"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-2 text-gray-600 dark:text-gray-300"
            >
              {showPassword ? "👁️" : "🙈"}
            </button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Password must be at least 6 characters, include 1 uppercase letter, 1 number, and 1 special character
          </p>
          <button
            type="submit"
            disabled={loading}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-green-300"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
