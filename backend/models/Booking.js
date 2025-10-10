import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    seats: { type: Number, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    movieId: { type: String, required: true }, 
    movieTitle: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
