
import express from "express";
import axios from "axios";

const router = express.Router();
const TMDB_BASE = "https://api.themoviedb.org/3";
const API_KEY = process.env.TMDB_API_KEY;


router.get("/search", async (req, res) => {
  try {
    const { query } = req.query;
    const response = await axios.get(`${TMDB_BASE}/search/movie`, {
      params: { api_key: API_KEY, query },
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get("/popular", async (req, res) => {
  try {
    const response = await axios.get(`${TMDB_BASE}/movie/popular`, {
      params: { api_key: API_KEY },
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
