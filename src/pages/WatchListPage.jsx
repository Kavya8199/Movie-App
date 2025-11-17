import React, { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";

export default function WatchlistPage({ onWatchTrailer }) {
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    const wlMovies = JSON.parse(localStorage.getItem("watchlist") || "[]");
    setWatchlist(wlMovies);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-20 px-4">
      <h1 className="text-2xl font-bold mb-6 text-center">🔖 My Watchlist</h1>

      {watchlist.length === 0 ? (
        <p className="text-center text-gray-400">Your watchlist is empty.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {watchlist.map((movie) => (
            <MovieCard key={movie.id} movie={movie} onWatchTrailer={onWatchTrailer} />
          ))}
        </div>
      )}
    </div>
  );
}
