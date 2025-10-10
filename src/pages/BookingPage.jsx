
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function BookingPage() {
  const { id } = useParams(); // Movie ID from URL
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [seats, setSeats] = useState(1);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const API_URL = "http://localhost:5000/api/bookings";

  const handleBooking = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!name || !email || !seats || !date || !time) {
      setError("All fields are required ❌");
      return;
    }

    try {
      const res = await axios.post(API_URL, {
        name,
        email,
        seats,
        date,
        time,
        movieId: id,
        movieTitle: `Movie ${id}`, // You can replace this with actual title
      });

      setMessage(res.data.message);
      setError("");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Booking failed ❌");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-bold mb-4 text-center">Book Your Tickets 🎬</h1>
        {error && <div className="bg-red-500 p-2 mb-4 rounded">{error}</div>}
        {message && <div className="bg-green-500 p-2 mb-4 rounded">{message}</div>}

        <form onSubmit={handleBooking} className="flex flex-col gap-3">
          <label>
            Number of Tickets
            <input
              type="number"
              min="1"
              max="10"
              value={seats}
              onChange={(e) => setSeats(Number(e.target.value))}
              className="w-full mt-1 p-2 rounded bg-gray-700 text-white"
            />
          </label>

          <label>
            Your Name
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full mt-1 p-2 rounded bg-gray-700 text-white"
              required
            />
          </label>

          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full mt-1 p-2 rounded bg-gray-700 text-white"
              required
            />
          </label>

          <label>
            Date
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full mt-1 p-2 rounded bg-gray-700 text-white"
              required
            />
          </label>

          <label>
            Time
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full mt-1 p-2 rounded bg-gray-700 text-white"
              required
            />
          </label>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded mt-2"
          >
            ✅ Confirm Booking
          </button>
        </form>
      </div>
    </div>
  );
}
