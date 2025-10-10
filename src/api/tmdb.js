
import axios from "axios";

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";


export async function fetchMovies({ query, genre, rating, language, page = 1 } = {}) {
  try {
    let url;
    const params = {
      api_key: API_KEY,
      page,
      language: "en-US",
    };

    if (query) {
      url = `${BASE_URL}/search/movie`;
      params.query = query;
    } else if (genre || rating || language) {
      url = `${BASE_URL}/discover/movie`;
      if (genre) params.with_genres = genre;
      if (language) params.with_original_language = language;
      if (rating) params["vote_average.gte"] = rating;
      params.sort_by = "popularity.desc";
    } else {
      url = `${BASE_URL}/movie/popular`;
    }

    const res = await axios.get(url, {
      params,
      headers: { "Cache-Control": "no-cache" },
    });

    return {
      results: res.data?.results || [],
      total_pages: res.data?.total_pages || 1,
    };
  } catch (err) {
    console.error("fetchMovies error:", err?.response?.data || err.message || err);
    return { results: [], total_pages: 1 };
  }
}


export async function fetchMovieVideos(movieId) {
  try {
    const res = await axios.get(`${BASE_URL}/movie/${movieId}/videos`, {
      params: {
        api_key: API_KEY,
        language: "en-US",
      },
      headers: { "Cache-Control": "no-cache" },
    });

    return res.data?.results || [];
  } catch (err) {
    console.error("fetchMovieVideos error:", err?.response?.data || err.message || err);
    return [];
  }
}
