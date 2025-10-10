
import React from "react";
import MovieCard from "./MovieCard";

export default function MovieList({ movies = [], onWatchTrailer, onBookNow }) {
  if (!movies || movies.length === 0) {
    return <p className="text-center text-gray-400 py-8">No movies found 🎬</p>;
  }

  return (
    <div className="mt-4 grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          onWatchTrailer={onWatchTrailer}
          onBookNow={onBookNow} 
        />
      ))}
    </div>
  );
}
