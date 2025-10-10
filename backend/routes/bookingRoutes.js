
import express from "express";
import Booking from "../models/Booking.js";
import User from "../models/User.js";
import Movie from "../models/Movie.js";
import Review from "../models/Review.js";

const router = express.Router();


router.post("/", async (req, res) => {
  const { name, email, seats, date, time, movieId, movieTitle } = req.body;

  if (!name || !email || !seats || !date || !time || !movieId || !movieTitle) {
    return res.status(400).json({ error: "All fields are required ❌" });
  }

  try {
    let user = await User.findOne({ email });
    if (!user) user = await User.create({ name, email, password: "temp1234" });


    let movie = await Movie.findOne({ tmdbId: movieId.toString() });
    if (!movie) {
      movie = await Movie.create({
        title: movieTitle,
        tmdbId: movieId.toString(),
        poster: "default.jpg",
        language: "Unknown",
        genre: "Unknown",
      });
    }


    const booking = await Booking.create({
      name,
      email,
      seats,
      date,
      time,
      movieId: movieId.toString(),
      movieTitle,
    });


    user.bookings.push(booking._id);
    await user.save();


    movie.bookings.push(booking._id);
    await movie.save();


    await Review.create({
      movieId: movieId.toString(),
      user: email,
      comment: `Booked ${seats} seat(s) for ${movieTitle}`,
      rating: 10,
    });

    res.status(201).json({ message: "Booking successful ✅", booking });
  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).json({ error: "Booking failed ❌" });
  }
});


router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch bookings ❌" });
  }
});

export default router;
