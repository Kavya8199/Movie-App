
import React from "react";

export default function MovieCarousel({ movies, onSelect }) {
  return (
    <div className="overflow-x-auto whitespace-nowrap scrollbar-hide px-6 py-4 bg-gray-900">
      {movies.map((movie) => (
        <img
          key={movie.id}
          src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
          alt={movie.title}
          className="inline-block w-40 h-60 rounded-lg object-cover mr-4 hover:scale-105 transition cursor-pointer"
          onClick={() => onSelect(movie)}
        />
      ))}
    </div>
  );
}
