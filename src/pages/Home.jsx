import React, { useEffect, useState, useContext, useCallback } from "react";
import HeroSection from "../components/HeroSection";
import MovieList from "../components/MovieList";
import BookingModal from "../components/BookingModal";
import { fetchMovies } from "../api/tmdb";
import { ThemeContext } from "../context/ThemeContext";
import { AuthContext } from "../context/AuthContext";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loginMessage, setLoginMessage] = useState("");
  const [selectedTrailer, setSelectedTrailer] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const { theme } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);

  const [search] = useState("");
  const [filters] = useState({ genre: "", rating: "", language: "" });

  const loadMovies = useCallback(
    async (pageNum = 1, reset = false) => {
      try {
        setLoading(true);
        const { results, total_pages } = await fetchMovies({
          query: search || undefined,
          genre: filters.genre || undefined,
          rating: filters.rating || undefined,
          language: filters.language || undefined,
          page: pageNum,
        });

        setTotalPages(total_pages || 1);

        if (reset) {
          setMovies(results);
          setPage(1);
        } else {
          setMovies((prev) => {
            const existingIds = new Set(prev.map((m) => m.id));
            return [...prev, ...results.filter((r) => !existingIds.has(r.id))];
          });
        }
      } catch (err) {
        console.error("Failed to fetch movies:", err);
      } finally {
        setLoading(false);
      }
    },
    [search, filters]
  );

  useEffect(() => {
    loadMovies(1, true);
  }, [loadMovies]);

  const handlePrevious = () => {
    if (page > 1) {
      const prev = page - 1;
      setPage(prev);
      loadMovies(prev, false);
    }
  };

  const handleNext = () => {
    if (page < totalPages) {
      const next = page + 1;
      setPage(next);
      loadMovies(next, false);
    }
  };

  const handleWatchTrailer = async (movieId) => {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US`
      );
      const data = await res.json();
      const trailer = data.results.find(
        (vid) => vid.type === "Trailer" && vid.site === "YouTube"
      );
      if (trailer) setSelectedTrailer(trailer.key);
    } catch (err) {
      console.error("Failed to load trailer", err);
    }
  };

  const handleBookNow = (movie) => {
    if (!user) {
      setLoginMessage("⚠ Please log in to book this movie");
      return;
    }
    setLoginMessage("");
    setSelectedMovie(movie);
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      
      {movies.length > 0 && (
        <div className="mt-16"> 
          <HeroSection
            movies={movies}
            onWatchTrailer={handleWatchTrailer}
            onBookNow={handleBookNow}
          />
        </div>
      )}

      
      {loginMessage && (
        <p className="text-center text-yellow-400 font-semibold my-4">
          {loginMessage}
        </p>
      )}

      <div className="max-w-7xl mx-auto px-4">
        <MovieList
          movies={movies}
          onWatchTrailer={handleWatchTrailer}
          onBookNow={handleBookNow}
        />
      </div>

      
      {selectedTrailer && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="relative w-[90%] md:w-[70%] lg:w-[60%] aspect-video">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${selectedTrailer}`}
              title="Trailer"
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
            <button
              onClick={() => setSelectedTrailer(null)}
              className="absolute -top-10 right-0 bg-red-600 px-3 py-1 rounded text-white"
            >
              ✖ Close
            </button>
          </div>
        </div>
      )}

     
      {selectedMovie && (
        <BookingModal
          movie={selectedMovie}
          isOpen={!!selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}

      
      <div className="max-w-7xl mx-auto px-4 py-6 flex justify-center items-center gap-4">
        <button
          onClick={handlePrevious}
          disabled={page === 1 || loading}
          className="px-4 py-2 bg-gray-500 hover:bg-gray-600 disabled:opacity-50 rounded text-white flex items-center gap-2"
        >
          ⏮
        </button>
        <span className="text-white font-semibold">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={page === totalPages || loading}
          className="px-4 py-2 bg-gray-500 hover:bg-gray-600 disabled:opacity-50 rounded text-white flex items-center gap-2"
        >
          ⏭
        </button>
        {loading && <span className="ml-4 text-gray-300">Loading...</span>}
      </div>
    </div>
  );
}
