import React, { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";

export default function FavoritesPage({ onWatchTrailer }) {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const favMovies = JSON.parse(localStorage.getItem("favorites") || "[]");
    setFavorites(favMovies);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-20 px-4">
      <h1 className="text-2xl font-bold mb-6 text-center">❤️ My Favorite Movies</h1>

      {favorites.length === 0 ? (
        <p className="text-center text-gray-400">No favorite movies yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {favorites.map((movie) => (
            <MovieCard key={movie.id} movie={movie} onWatchTrailer={onWatchTrailer} />
          ))}
        </div>
      )}
    </div>
  );
}
