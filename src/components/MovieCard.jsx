
import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import BookingModal from "./BookingModal";
import { AuthContext } from "../context/AuthContext";

export default function MovieCard({ movie, onWatchTrailer }) {
  const { user } = useContext(AuthContext);
  const [favorite, setFavorite] = useState(false);
  const [watchlist, setWatchlist] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [animateHeart, setAnimateHeart] = useState(false);
  const [showLoginMessage, setShowLoginMessage] = useState(false); 

  
  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem("favorites") || "[]");
    const wl = JSON.parse(localStorage.getItem("watchlist") || "[]");
    setFavorite(favs.includes(movie.id));
    setWatchlist(wl.includes(movie.id));
  }, [movie.id]);

  
  const toggleFavorite = () => {
    let favs = JSON.parse(localStorage.getItem("favorites") || "[]");
    if (favorite) favs = favs.filter((i) => i !== movie.id);
    else favs.push(movie.id);
    localStorage.setItem("favorites", JSON.stringify(favs));
    setFavorite(!favorite);
    setAnimateHeart(true);
    setTimeout(() => setAnimateHeart(false), 300);
  };

  
  const toggleWatchlist = () => {
    let wl = JSON.parse(localStorage.getItem("watchlist") || "[]");
    if (watchlist) wl = wl.filter((i) => i !== movie.id);
    else wl.push(movie.id);
    localStorage.setItem("watchlist", JSON.stringify(wl));
    setWatchlist(!watchlist);
  };

  
  const handleBook = () => {
    if (!user) {
      setShowLoginMessage(true);
      setTimeout(() => setShowLoginMessage(false), 2000);
      return;
    }
    setShowBooking(true);
  };

  return (
    <>
      <div className="relative bg-gray-800 rounded-2xl shadow-md overflow-hidden hover:scale-[1.03] transition-transform duration-300 flex flex-col">
        
        {showLoginMessage && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20">
            <p className="text-red-400 text-sm font-semibold bg-black/70 px-3 py-2 rounded-lg shadow-md animate-pulse">
              ⚠️ Please log in to book tickets
            </p>
          </div>
        )}

       
        <button
          onClick={toggleFavorite}
          className={`absolute top-2 left-2 w-9 h-9 flex items-center justify-center rounded-full transition-transform ${
            animateHeart ? "scale-125" : "scale-100"
          } hover:scale-110 ${
            favorite ? "bg-red-100 text-red-500" : "bg-gray-700 text-white"
          }`}
          title={favorite ? "Remove from Favorites" : "Add to Favorites"}
        >
          {favorite ? "❤️" : "♡"}
        </button>

        
        <button
          onClick={toggleWatchlist}
          className={`absolute top-14 left-2 w-9 h-9 flex items-center justify-center rounded-full transition-transform hover:scale-110 ${
            watchlist ? "bg-yellow-100 text-yellow-400" : "bg-gray-700 text-white"
          }`}
          title={watchlist ? "Remove from Watchlist" : "Add to Watchlist"}
        >
          🔖
        </button>

        
        <Link to={`/movie/${movie.id}`}>
          <img
            src={
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : "https://via.placeholder.com/300x450"
            }
            alt={movie.title}
            className="w-full aspect-[2/3] object-cover"
          />
        </Link>


        <div className="p-3 flex flex-col flex-grow justify-between">
          <div>
            <Link to={`/movie/${movie.id}`}>
              <h3 className="text-md font-semibold truncate">{movie.title}</h3>
            </Link>
            <p className="text-sm text-gray-400">
              {movie.release_date ? movie.release_date.split("-")[0] : "N/A"} • ⭐{" "}
              {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"} /10
            </p>
            <p className="text-blue-400 font-semibold mt-1">
              Price: ₹{movie.price || 450}
            </p>
          </div>

          
          <div className="flex items-center gap-2 mt-2">
            <button
              onClick={handleBook}
              className="flex-1 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-center hover:bg-blue-700 transition"
            >
              Book Now
            </button>
            <button
              onClick={() => onWatchTrailer && onWatchTrailer(movie.id)}
              className="bg-gray-700 hover:bg-gray-800 text-white px-3 py-1.5 rounded-lg font-semibold transition"
              title="Watch Trailer"
            >
              ▶
            </button>
          </div>
        </div>
      </div>

      
      {showBooking && (
        <BookingModal
          movie={movie}
          onClose={() => setShowBooking(false)}
        />
      )}
    </>
  );
}
