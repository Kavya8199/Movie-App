
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const API_URL = "http://localhost:5000";

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [credits, setCredits] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    userName: "",
    email: "",
    seats: "",
    date: "",
    time: "",
  });


  useEffect(() => {
    if (!API_KEY) {
      setError("TMDB API key not found. Add REACT_APP_TMDB_API_KEY to your .env");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    const detailsReq = axios.get(`https://api.themoviedb.org/3/movie/${id}`, {
      params: { api_key: API_KEY, language: "en-US" },
    });
    const creditsReq = axios.get(
      `https://api.themoviedb.org/3/movie/${id}/credits`,
      { params: { api_key: API_KEY, language: "en-US" } }
    );

    axios
      .all([detailsReq, creditsReq])
      .then(
        axios.spread((detailsRes, creditsRes) => {
          setMovie(detailsRes.data);
          setCredits(creditsRes.data);
        })
      )
      .catch((err) => {
        console.error("❌ MovieDetails fetch error:", err?.response || err.message);
        setError("Failed to load movie details.");
      })
      .finally(() => setLoading(false));
  }, [id]);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to book tickets ❌");
        navigate("/login");
        return;
      }

      const payload = {
        userName: form.userName,
        email: form.email,
        movieTitle: movie?.title || "Untitled",
        seats: form.seats.split(",").map((s) => s.trim()),
        date: form.date,
        time: form.time,
        ticketPrice: 200,
      };

      console.log("📤 Sending booking payload:", payload);

      const res = await axios.post(`${API_URL}/api/bookings`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("✅ Booking response:", res.data);
      alert("Booking confirmed ✅");
      navigate("/admin");
    } catch (err) {
      console.error("❌ Booking error:", err.response?.data || err.message);
      alert(
        `Booking failed ❌\n${
          err.response?.data?.message || err.message || "Unknown error"
        }`
      );
    }
  };


  const openTrailer = async () => {
    try {
      const res = await axios.get(
        `https://api.themoviedb.org/3/movie/${id}/videos`,
        { params: { api_key: API_KEY, language: "en-US" } }
      );
      const vids = res.data?.results || [];
      const trailer =
        vids.find(
          (v) => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser")
        ) || vids.find((v) => v.site === "YouTube");
      if (trailer) setTrailerKey(trailer.key);
      else alert("No trailer available for this title.");
    } catch (err) {
      console.error("Failed to fetch trailer:", err);
      alert("Failed to fetch trailer.");
    }
  };


  if (loading) return <div className="p-6 text-white">Loading movie details…</div>;
  if (error) return <div className="p-6 text-red-400">{error}</div>;
  if (!movie) return <div className="p-6 text-white">No movie found.</div>;

  const director = credits?.crew?.find((p) => p.job === "Director");
  const topCast = (credits?.cast || []).slice(0, 8);

  return (
    <>
      
      <div
        className="relative bg-cover bg-center text-white"
        style={{
          backgroundImage: movie.backdrop_path
            ? `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
            : undefined,
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative max-w-6xl mx-auto px-6 py-14 flex gap-8">
          
          <img
            src={
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : "https://via.placeholder.com/300x450?text=No+Image"
            }
            alt={movie.title}
            className="w-48 md:w-64 rounded-lg shadow-lg object-cover"
          />

          
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">{movie.title}</h1>

            <div className="flex items-center gap-4 text-sm text-gray-200 mb-4">
              <span>{movie.release_date ? movie.release_date.split("-")[0] : "—"}</span>
              <span>•</span>
              <span>{movie.runtime ? `${movie.runtime}m` : "—"}</span>
              <span>•</span>
              <span>{(movie.genres || []).map((g) => g.name).join(", ")}</span>
            </div>

            <p className="text-gray-200 max-w-2xl mb-6">{movie.overview}</p>

            <div className="flex items-center gap-3">
              <button
                onClick={openTrailer}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
              >
                ▶ Play Trailer
              </button>

              <button
                onClick={() => navigate(-1)}
                className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-white"
              >
                ← Back
              </button>

              <div className="ml-4 px-3 py-2 bg-green-700 rounded text-white">
                ⭐ {movie.vote_average?.toFixed(1)}/10
              </div>
            </div>

            
            {director && (
              <div className="mt-6 flex items-center gap-3 bg-gray-800 text-white p-3 rounded">
                <img
                  src={
                    director.profile_path
                      ? `https://image.tmdb.org/t/p/w200${director.profile_path}`
                      : "https://via.placeholder.com/56"
                  }
                  alt={director.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="text-xs text-gray-300">Director</div>
                  <div className="font-semibold">{director.name}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      
      <div className="max-w-4xl mx-auto p-6 bg-gray-900 text-white rounded-lg mt-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Book Tickets</h2>
        <form onSubmit={handleConfirm} className="space-y-4">
          <input
            type="text"
            name="userName"
            placeholder="Your Name"
            value={form.userName}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
            required
          />
          <input
            type="text"
            name="seats"
            placeholder="Seats (e.g. A1,A2)"
            value={form.seats}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
            required
          />
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
            required
          />
          <input
            type="time"
            name="time"
            value={form.time}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
            required
          />
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white w-full"
          >
            Confirm Booking
          </button>
        </form>
      </div>

      
      <div className="max-w-6xl mx-auto px-6 py-8 bg-gray-900 text-white">
        <h2 className="text-2xl mb-4">Cast</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
          {topCast.map((actor) => (
            <div key={actor.id} className="flex flex-col items-center text-center">
              <img
                src={
                  actor.profile_path
                    ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                    : "https://via.placeholder.com/120"
                }
                alt={actor.name}
                className="w-24 h-28 object-cover rounded-md mb-2"
              />
              <div className="text-sm">{actor.name}</div>
              <div className="text-xs text-gray-400">{actor.character}</div>
            </div>
          ))}
        </div>
      </div>

      
      {trailerKey && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl aspect-video bg-black rounded">
            <iframe
              title="Trailer"
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
              className="w-full h-full rounded"
              allow="autoplay; encrypted-media; picture-in-picture"
            />
            <button
              onClick={() => setTrailerKey(null)}
              className="absolute top-2 right-2 bg-white/20 hover:bg-white/30 text-white rounded px-3 py-1"
            >
              ✖
            </button>
          </div>
        </div>
      )}
    </>
  );
}
