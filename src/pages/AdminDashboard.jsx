import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
const DEFAULT_TICKET_PRICE = 450; // ✅ Updated ticket price

export default function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await axios.get(`${API_URL}/api/bookings`);
        setBookings(res.data);
      } catch (err) {
        console.error("❌ Error fetching bookings:", err);
        setError("Failed to load bookings. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter(
    (b) =>
      b.movieTitle?.toLowerCase().includes(search.toLowerCase()) ||
      b.name?.toLowerCase().includes(search.toLowerCase()) ||
      b.email?.toLowerCase().includes(search.toLowerCase())
  );

  const totalSeats = bookings.reduce((sum, b) => sum + Number(b.seats || 0), 0);
  const totalRevenue = bookings.reduce(
    (sum, b) =>
      sum + Number(b.seats || 0) * Number(b.price || DEFAULT_TICKET_PRICE),
    0
  );

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white transition-colors duration-300">
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-blue-600 dark:text-blue-400">
          🎬 Admin Dashboard
        </h1>

       
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {[
            {
              label: "Bookings",
              value: bookings.length,
              symbol: "🎟️",
              bg: "bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500",
            },
            {
              label: "Seats",
              value: totalSeats,
              symbol: "🪑",
              bg: "bg-gradient-to-r from-yellow-400 via-red-400 to-pink-400",
            },
            {
              label: "Revenue",
              value: `₹${totalRevenue}`,
              symbol: "💰",
              bg: "bg-gradient-to-r from-green-400 via-teal-500 to-blue-500",
            },
          ].map((box) => (
            <div
              key={box.label}
              className={`p-4 rounded-lg shadow-md text-white text-center font-semibold ${box.bg} hover:scale-105 transition-transform`}
            >
              <div className="text-3xl mb-1">{box.symbol}</div>
              <div className="text-sm mb-1">{box.label}</div>
              <div className="text-xl font-bold">{box.value}</div>
            </div>
          ))}
        </div>

       
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by movie, name, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 rounded border border-gray-400 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white w-full md:w-80"
          />
        </div>

       
        {loading && (
          <p className="text-gray-500 dark:text-gray-400">
            Loading bookings...
          </p>
        )}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && (
          <div className="overflow-x-auto rounded-lg shadow-lg">
            <table className="min-w-full table-auto bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700">
              <thead className="bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                <tr>
                  <th className="p-2 text-left">Movie</th>
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Email</th>
                  <th className="p-2 text-left">Seats</th>
                  <th className="p-2 text-left">Price</th>
                  <th className="p-2 text-left">Total</th>
                  <th className="p-2 text-left">Date</th>
                  <th className="p-2 text-left">Time</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.length > 0 ? (
                  filteredBookings.map((b, idx) => (
                    <tr
                      key={b._id}
                      className={`border-t border-gray-300 dark:border-gray-700 ${
                        idx % 2 === 0
                          ? "bg-gray-100 dark:bg-gray-700"
                          : "bg-gray-200 dark:bg-gray-800"
                      } hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors`}
                    >
                      <td className="p-2 font-medium">{b.movieTitle}</td>
                      <td className="p-2">{b.name}</td>
                      <td className="p-2">{b.email}</td>
                      <td className="p-2 font-semibold text-green-600 dark:text-green-400">
                        {b.seats} {b.seats > 1 ? "seats" : "seat"}
                      </td>
                      <td className="p-2 font-semibold text-yellow-600 dark:text-yellow-400">
                        ₹{b.price || DEFAULT_TICKET_PRICE}
                      </td>
                      <td className="p-2 font-semibold text-blue-600 dark:text-blue-400">
                        ₹
                        {Number(b.price || DEFAULT_TICKET_PRICE) *
                          Number(b.seats || 0)}
                      </td>
                      <td className="p-2">{b.date}</td>
                      <td className="p-2">{b.time}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="8"
                      className="p-4 text-center text-gray-500 dark:text-gray-400 italic"
                    >
                      No bookings found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      
      <style>
        {`
          @keyframes gradient-x {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animate-gradient-x {
            background-size: 200% 200%;
            animation: gradient-x 6s ease infinite;
          }
        `}
      </style>
    </div>
  );
}
