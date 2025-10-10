import express from "express";
import Review from "../models/Review.js";
import Movie from "../models/Movie.js";

const router = express.Router();


router.get("/:movieId", async (req, res) => {
  try {
    const { movieId } = req.params;
    const movie = await Movie.findOne({ tmdbId: movieId });
    if (!movie) return res.status(404).json({ error: "Movie not found ❌" });

    const reviews = await Review.find({ movieId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch reviews ❌" });
  }
});


router.post("/", async (req, res) => {
  try {
    const { movieId, user, comment, rating } = req.body;
    if (!movieId || !user || !comment) return res.status(400).json({ error: "Missing required fields ❌" });

    const movie = await Movie.findOne({ tmdbId: movieId });
    if (!movie) return res.status(404).json({ error: "Movie not found ❌" });

    const review = new Review({ movieId, user, comment, rating });
    await review.save();
    res.json({ message: "Review added ✅", review });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save review ❌" });
  }
});

export default router;
