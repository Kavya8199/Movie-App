import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const API_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
const TICKET_PRICE = 450;
const MAX_SEATS = 6;
const ROWS = 10;
const SEATS_PER_ROW = 12;

const SEAT_IMG = "https://cdn-icons-png.flaticon.com/512/814/814513.png"; 
const SEAT_SELECTED_IMG = "https://cdn-icons-png.flaticon.com/512/2922/2922852.png"; 

const SEAT_WIDTH = 35;
const SEAT_HEIGHT = 25;
const AISLE_AFTER = 6;

export default function BookingModal({ movie, onClose }) {
  const { user } = useContext(AuthContext);

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    selectedSeats: [],
    date: "",
    time: "",
  });

  const [successMessage, setSuccessMessage] = useState("");

  const handleSeatClick = (seatNum) => {
    if (form.selectedSeats.includes(seatNum)) {
      setForm({
        ...form,
        selectedSeats: form.selectedSeats.filter((s) => s !== seatNum),
      });
    } else if (form.selectedSeats.length < MAX_SEATS) {
      setForm({
        ...form,
        selectedSeats: [...form.selectedSeats, seatNum],
      });
    } else {
      alert(`You can book a maximum of ${MAX_SEATS} seats`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.selectedSeats.length === 0) {
      alert("Please select at least one seat");
      return;
    }

    try {
      const payload = {
        name: form.name,
        email: form.email,
        seats: form.selectedSeats.length,
        seatNumbers: form.selectedSeats,
        date: form.date,
        time: form.time,
        movieId: movie._id || movie.id,
        movieTitle: movie.title,
      };

      await axios.post(`${API_URL}/api/bookings`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      setSuccessMessage(`🎉 Booking Successful for ${form.selectedSeats.length} seat(s)!`);
      setForm({
        name: user?.name || "",
        email: user?.email || "",
        selectedSeats: [],
        date: "",
        time: "",
      });
    } catch (err) {
      console.error("Booking failed:", err.response?.data || err.message);
      setSuccessMessage(err.response?.data?.error || "❌ Booking failed. Please try again.");
    }
  };

  const showTimes = ["10:00 AM", "1:00 PM", "4:00 PM", "7:00 PM", "10:00 PM"];

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/90 backdrop-blur-sm">
     
      <div className="w-full max-w-[900px] p-5 rounded-xl shadow-lg bg-gray-900 text-white">
        {successMessage && (
          <div className="mb-2 p-2 bg-green-600 text-white rounded text-center text-sm font-semibold">
            {successMessage}
          </div>
        )}

        {user && (
          <p className="mb-1 text-xs text-gray-400 text-center">
            Welcome, <span className="font-semibold">{user.name || user.email}</span>!
          </p>
        )}

        <h2 className="text-lg font-bold mb-3 text-center">{`Book Tickets for ${movie?.title}`}</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex gap-6">
            
            <img
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                  : "https://via.placeholder.com/150x220"
              }
              alt={movie.title}
              className="w-36 h-52 rounded-lg shadow-md object-cover"
            />

            
            <div className="flex-1 flex flex-col">
              <p className="mb-1 font-semibold underline text-sm">
                Select Seats (Max {MAX_SEATS})
              </p>

              
              <div
                className="p-2 bg-gray-800 rounded border overflow-y-auto"
                style={{
                  maxHeight: "160px",
                  minHeight: "140px",
                }}
              >
                <div className="text-center text-gray-400 text-xs mb-2">
                  Screen This Way 🎬
                </div>
                {[...Array(ROWS)].map((_, rowIndex) => {
                  const rowLabel = String.fromCharCode(65 + rowIndex);
                  return (
                    <div
                      key={rowLabel}
                      className="flex justify-center mb-1 items-center gap-1"
                    >
                      <span className="w-4 text-xs mr-1">{rowLabel}</span>
                      {[...Array(SEATS_PER_ROW)].map((_, seatIndex) => {
                        const seatNum = rowIndex * SEATS_PER_ROW + seatIndex + 1;
                        const selected = form.selectedSeats.includes(seatNum);

                        if (seatIndex === AISLE_AFTER)
                          return <div key={`aisle-${seatNum}`} className="w-6" />;

                        return (
                          <img
                            key={seatNum}
                            src={selected ? SEAT_SELECTED_IMG : SEAT_IMG}
                            alt={`Seat ${rowLabel}${seatIndex + 1}`}
                            style={{
                              width: `${SEAT_WIDTH}px`,
                              height: `${SEAT_HEIGHT}px`,
                            }}
                            className="cursor-pointer hover:scale-110 transition-transform"
                            onClick={() => handleSeatClick(seatNum)}
                          />
                        );
                      })}
                    </div>
                  );
                })}
              </div>

              <div className="p-1 bg-gray-800 rounded-md text-center text-yellow-400 text-sm font-semibold shadow-inner mt-2">
                Total Seats: {form.selectedSeats.length} | Total Price: ₹
                {form.selectedSeats.length * TICKET_PRICE}
              </div>
            </div>
          </div>

        
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Your Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="flex-1 p-2 rounded-md bg-gray-700 border border-gray-600 text-white text-sm"
            />
            <input
              type="email"
              placeholder="Your Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              className="flex-1 p-2 rounded-md bg-gray-700 border border-gray-600 text-white text-sm"
            />
          </div>

          <div className="flex gap-2 items-center">
            <select
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
              required
              className="flex-1 p-2 rounded-md bg-gray-700 border border-gray-600 text-white text-sm cursor-pointer"
            >
              <option value="" disabled>
                🕒 Select Time
              </option>
              {showTimes.map((t, idx) => (
                <option key={idx} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              required
              className="flex-1 p-2 rounded-md bg-gray-700 border border-gray-600 text-white text-sm"
            />
          </div>

          
          <div className="flex gap-2 mt-2">
            <button
              type="submit"
              className="flex-1 py-2 rounded font-semibold bg-blue-600 hover:bg-blue-700 text-white text-sm"
            >
              Confirm Booking
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded font-semibold bg-red-600 hover:bg-red-700 text-white text-sm"
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
