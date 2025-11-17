import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import BookingModal from "./BookingModal";

export default function HeroSection({ movies, onWatchTrailer, onBookNow }) {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [index, setIndex] = useState(0);
  const [message, setMessage] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [movieDetails, setMovieDetails] = useState(null);

  const topMovies = (movies || []).slice(0, 10);

  useEffect(() => {
    if (!topMovies.length) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % topMovies.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [topMovies.length]);

  const movie = topMovies[index];

  useEffect(() => {
    if (!movie) return;
    const fetchDetails = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US`
        );
        const data = await res.json();
        setMovieDetails(data);
      } catch (err) {
        console.error("Failed to fetch movie details:", err);
      }
    };
    fetchDetails();
  }, [movie]);

  const handleBook = (movie) => {
    if (!user) {
      setMessage("⚠ Please log in to book a movie");
      return;
    }
    setMessage("");
    onBookNow(movie);
  };

  const stars = Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    size: Math.random() * 6 + 3,
    left: Math.random() * 100,
    top: Math.random() * 100,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 10,
  }));

  return (
    <div className="relative w-full h-[65vh] overflow-hidden perspective mt-0">
      
      <div className="absolute inset-0 cube-container z-0">
        {["front", "back", "right", "left", "top", "bottom"].map((face) => (
          <div
            key={face}
            className={`cube-face ${face}`}
            style={{
              backgroundImage: `url(https://image.tmdb.org/t/p/original${movie?.backdrop_path})`,
            }}
          />
        ))}
      </div>

     
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-transparent z-10" />

      
      <div className="absolute inset-0 z-20 overflow-hidden">
        {stars.map((s) => (
          <span
            key={s.id}
            className="absolute text-yellow-300 animate-twinkle"
            style={{
              fontSize: `${s.size}px`,
              top: `${s.top}%`,
              left: `${s.left}%`,
              animationDuration: `${s.duration}s`,
              animationDelay: `${s.delay}s`,
              textShadow: `0 0 ${s.size / 2}px #FFD700, 0 0 ${s.size}px #fff`,
            }}
          >
            ✦
          </span>
        ))}
      </div>

      {/* Movie Info */}
      <div className="relative z-30 px-6 md:px-20 flex flex-col justify-end h-full pb-8 max-w-full text-white animate-appear">
        <h2 className="text-2xl md:text-4xl font-extrabold drop-shadow-lg leading-tight">
          {movie.title}
        </h2>
        <p className="mt-1 text-gray-300 text-sm">
          {movie.release_date?.split("-")[0]} • ⭐ {movie.vote_average?.toFixed(1)}/10
        </p>
        <p className="mt-2 text-gray-200 text-sm line-clamp-3">{movie.overview}</p>

        <div className="flex gap-3 mt-4 flex-wrap">
          <button
            onClick={() => handleBook(movie)}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold shadow-md shadow-red-500/50"
          >
            🎟️ Book Now
          </button>
          <button
            onClick={() => onWatchTrailer(movie.id)}
            className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg font-semibold shadow-md shadow-gray-500/50"
          >
            ▶ Watch Trailer
          </button>
          <button
            onClick={() => navigate(`/movie/${movie.id}`)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold shadow-md shadow-blue-500/50"
          >
            ℹ More Info
          </button>
        </div>

        {message && <p className="mt-1 text-yellow-400 font-semibold">{message}</p>}

        {movieDetails && (
          <div className="mt-2 text-gray-200 space-y-1 text-sm">
            <p>
              <strong>Genres:</strong> {movieDetails.genres?.map((g) => g.name).join(", ")}
            </p>
            <p>
              <strong>Runtime:</strong> {movieDetails.runtime} min
            </p>
            <p>
              <strong>Language:</strong> {movieDetails.original_language?.toUpperCase()}
            </p>
            <p>
              <strong>Popularity:</strong> {movieDetails.popularity} •{" "}
              <strong>Votes:</strong> {movieDetails.vote_count}
            </p>
          </div>
        )}
      </div>

      {selectedMovie && (
        <BookingModal
          movie={selectedMovie}
          isOpen={!!selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}

      <style>{`
        .perspective { perspective: 1000px; }

        .cube-container {
          position: absolute; width: 100vw; height: 100%;
          transform-style: preserve-3d;
          animation: cube-rotate 10s infinite linear;
          filter: brightness(1.2) contrast(1.1) saturate(1.1);
        }

        .cube-face {
          position: absolute; width: 100vw; height: 100%;
          background-size: cover; background-position: center;
          border: 2px solid rgba(255,255,255,0.05);
          box-shadow: 0 0 40px rgba(255,255,255,0.05);
          filter: brightness(1.15) contrast(1.1);
        }

        .front  { transform: translateZ(300px); }
        .back   { transform: rotateY(180deg) translateZ(300px); }
        .right  { transform: rotateY(90deg) translateZ(300px); }
        .left   { transform: rotateY(-90deg) translateZ(300px); }
        .top    { transform: rotateX(90deg) translateZ(300px); }
        .bottom { transform: rotateX(-90deg) translateZ(300px); }

        @keyframes cube-rotate {
          0% { transform: rotateX(0deg) rotateY(0deg); }
          50% { transform: rotateX(15deg) rotateY(180deg); }
          100% { transform: rotateX(0deg) rotateY(360deg); }
        }

        @keyframes twinkle {
          0%,100% { opacity:0.3; transform:scale(1); }
          50% { opacity:1; transform:scale(1.2); }
        }

        .animate-twinkle { animation: twinkle infinite ease-in-out; }

        @keyframes appear {
          0% { opacity:0; transform:translateY(15px); }
          100% { opacity:1; transform:translateY(0); }
        }

        .animate-appear { animation: appear 1s ease forwards; }
      `}</style>
    </div>
  );
}
