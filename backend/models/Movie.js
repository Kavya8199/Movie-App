import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    poster: { type: String, required: true },
    language: { type: String, required: true },
    genre: { type: String, required: true },
    tmdbId: { type: String, required: true, unique: true }, 
    bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Booking" }],
  },
  { timestamps: true }
);

export default mongoose.model("Movie", movieSchema);
