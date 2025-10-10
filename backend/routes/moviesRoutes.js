import express from "express";
import Movie from "../models/Movie.js";

const router = express.Router();


router.get("/", async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch movies ❌" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, poster, language, genre, tmdbId } = req.body;
    if (!title || !poster || !language || !genre || !tmdbId)
      return res.status(400).json({ error: "All fields are required ❌" });

    const movie = new Movie({ title, poster, language, genre, tmdbId: tmdbId.toString() });
    await movie.save();
    res.status(201).json(movie);
  } catch (err) {
    res.status(500).json({ error: "Failed to add movie ❌" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Movie.findByIdAndDelete(req.params.id);
    res.json({ message: "Movie deleted ✅" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete movie ❌" });
  }
});

export default router;
