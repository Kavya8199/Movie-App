import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import axios from "axios";
import Navbar from "./Navbar";

const API_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
const TICKET_PRICE = 450;
const MAX_SEATS = 6;
const ROWS = 10;
const SEATS_PER_ROW = 12;
const AISLE_AFTER = 6;

const SEAT_IMG =
  "https://cdn.prod.website-files.com/6019e43dcfad3c059841794a%2F6019e43dcfad3c69d3417be5_Corvette-seat.png";

const SEAT_SELECTED_COLOR = "#d8d5c2ff"; 
const SEAT_BOOKED_COLOR = "#32CD32";  

export default function BookingModal({ movie, onClose }) {
  const { user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    selectedSeats: [],
    date: "",
    time: "",
  });

  const [bookedSeats, setBookedSeats] = useState([]); 
  const [successBooking, setSuccessBooking] = useState(null); 

  const showTimes = ["10:00 AM", "1:00 PM", "4:00 PM", "7:00 PM", "10:00 PM"];

  const handleSeatClick = (seatNum) => {
    if (bookedSeats.includes(seatNum)) return; 
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

     
      setBookedSeats([...bookedSeats, ...form.selectedSeats]);

      
      setSuccessBooking({
        movieTitle: movie.title,
        seats: form.selectedSeats.length,
      });

    
      setForm({ ...form, selectedSeats: [] });
    } catch (err) {
      console.error("Booking failed:", err.response?.data || err.message);
      setSuccessBooking({
        error: err.response?.data?.error || "Booking failed ❌",
      });
    }
  };

  return (
    <div
      className={`fixed inset-0 flex flex-col z-50 ${
        theme === "dark" ? "bg-black/90" : "bg-white/90"
      } backdrop-blur-sm`}
    >
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-5">
        <div
          className={`w-full max-w-[900px] p-5 rounded-xl shadow-lg ${
            theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
          }`}
        >
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
                  className="p-2 rounded border overflow-y-auto"
                  style={{ maxHeight: "160px", minHeight: "140px" }}
                >
                  <div className="text-center text-gray-400 text-xs mb-2">Screen This Way 🎬</div>
                  {[...Array(ROWS)].map((_, rowIndex) => {
                    const rowLabel = String.fromCharCode(65 + rowIndex);
                    return (
                      <div key={rowLabel} className="flex justify-center mb-1 items-center gap-1">
                        <span className="w-4 text-xs mr-1">{rowLabel}</span>
                        {[...Array(SEATS_PER_ROW)].map((_, seatIndex) => {
                          const seatNum = rowIndex * SEATS_PER_ROW + seatIndex + 1;
                          const selected = form.selectedSeats.includes(seatNum);
                          const booked = bookedSeats.includes(seatNum);

                          if (seatIndex === AISLE_AFTER) return <div key={`aisle-${seatNum}`} className="w-6" />;

                          return (
                            <img
                              key={seatNum}
                              src={SEAT_IMG}
                              alt={`Seat ${rowLabel}${seatIndex + 1}`}
                              style={{
                                width: "35px",
                                height: "25px",
                                filter: booked
                                  ? `brightness(80%) drop-shadow(0 0 2px ${SEAT_BOOKED_COLOR})`
                                  : selected
                                  ? `brightness(100%) drop-shadow(0 0 2px ${SEAT_SELECTED_COLOR})`
                                  : "none",
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

                <div className="p-1 rounded-md text-center text-yellow-400 text-sm font-semibold shadow-inner mt-2">
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
                className={`flex-1 p-2 rounded-md border text-sm ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-400 text-black"
                }`}
              />
              <input
                type="email"
                placeholder="Your Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className={`flex-1 p-2 rounded-md border text-sm ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-400 text-black"
                }`}
              />
            </div>

            <div className="flex gap-2 items-center">
              <select
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                required
                className={`flex-1 p-2 rounded-md border text-sm cursor-pointer ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-400 text-black"
                }`}
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
                className={`flex-1 p-2 rounded-md border text-sm ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-400 text-black"
                }`}
              />
            </div>

            <div className="flex gap-2 mt-2">
              <button
                type="submit"
                className={`flex-1 py-2 rounded font-semibold text-white text-sm ${
                  theme === "dark"
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-blue-400 hover:bg-blue-500"
                }`}
              >
                Confirm Booking
              </button>
              <button
                type="button"
                onClick={onClose}
                className={`flex-1 py-2 rounded font-semibold text-white text-sm ${
                  theme === "dark"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-red-400 hover:bg-red-500"
                }`}
              >
                Close
              </button>
            </div>
          </form>
        </div>
      </div>

      
      {successBooking && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 p-4 rounded shadow-lg z-50 bg-green-500 text-white font-semibold text-center">
          {successBooking.error
            ? successBooking.error
            : `🎉 Booking Successful for ${successBooking.seats} seat(s) in "${successBooking.movieTitle}"`}
        </div>
      )}
    </div>
  );
}
