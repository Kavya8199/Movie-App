import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import { AuthContext } from "../context/AuthContext";

export default function Navbar({
  filters = { genre: "", rating: "", language: "" },
  onFiltersChange = () => {},
  search = "",
  setSearch = () => {},
  onSearch = () => {},
}) {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user, logout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [showListMenu, setShowListMenu] = useState(false);

  const handleChange = (field, value) => {
    onFiltersChange({ ...filters, [field]: value === "All" ? "" : value });
  };

  const genres = [
    { id: "", name: "All Genres" },
    { id: 28, name: "Action" },
    { id: 12, name: "Adventure" },
    { id: 16, name: "Animation" },
    { id: 35, name: "Comedy" },
    { id: 80, name: "Crime" },
    { id: 99, name: "Documentary" },
    { id: 18, name: "Drama" },
    { id: 10751, name: "Family" },
    { id: 14, name: "Fantasy" },
    { id: 36, name: "History" },
    { id: 27, name: "Horror" },
    { id: 10402, name: "Music" },
    { id: 9648, name: "Mystery" },
    { id: 10749, name: "Romance" },
    { id: 878, name: "Sci-Fi" },
    { id: 53, name: "Thriller" },
  ];

  const languages = [
    { code: "", name: "All Languages" },
    { code: "en", name: "English" },
    { code: "hi", name: "Hindi" },
    { code: "te", name: "Telugu" },
    { code: "ta", name: "Tamil" },
    { code: "ml", name: "Malayalam" },
    { code: "kn", name: "Kannada" },
    { code: "bn", name: "Bengali" },
    { code: "mr", name: "Marathi" },
    { code: "ja", name: "Japanese" },
    { code: "ko", name: "Korean" },
  ];

  const ratings = Array.from({ length: 10 }, (_, i) => i + 1);
  const selectClasses =
    "p-1.5 rounded-md text-black shadow-md hover:opacity-90 transition-all font-bold text-sm";

  return (
    <nav className="fixed top-0 w-full z-40 bg-gradient-to-r from-blue-900 via-indigo-800 to-purple-700 text-white shadow-lg backdrop-blur-lg transition-all duration-500">
      <div className="max-w-7xl mx-auto px-4 h-14 flex justify-between items-center relative">
        
        {/* --- Logo --- */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src="https://png.pngtree.com/element_our/20190603/ourmid/pngtree-movie-board-icon-image_1455346.jpg"
            alt="CineScope Logo"
            className="w-7 h-7 object-contain drop-shadow-lg"
          />
          <span className="text-base font-extrabold tracking-wide">CineScope</span>
        </Link>

        {/* --- Filters + Search --- */}
        <div className="flex items-center gap-2">
          <select
            className={`${selectClasses}`}
            value={filters.genre}
            onChange={(e) => handleChange("genre", e.target.value)}
            style={{
              fontFamily: "'Adobe Garamond Pro', serif",
              fontWeight: "bold",
              background: "linear-gradient(to right, #6ee7b7, #3b82f6)",
              border: "2px solid #34d399",
            }}
          >
            {genres.map((g) => (
              <option key={g.id || "all"} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>

          <select
            className={`${selectClasses}`}
            value={filters.rating}
            onChange={(e) => handleChange("rating", e.target.value)}
            style={{
              fontFamily: "'Adobe Garamond Pro', serif",
              fontWeight: "bold",
              background: "linear-gradient(to right, #fcd34d, #f97316)",
              border: "2px solid #f59e0b",
            }}
          >
            <option value="">All Ratings</option>
            {ratings.map((r) => (
              <option key={r} value={r}>
                ⭐ {r}+
              </option>
            ))}
          </select>

          <select
            className={`${selectClasses}`}
            value={filters.language}
            onChange={(e) => handleChange("language", e.target.value)}
            style={{
              fontFamily: "'Adobe Garamond Pro', serif",
              fontWeight: "bold",
              background: "linear-gradient(to right, #3b82f6, #9333ea)",
              border: "2px solid #6366f1",
            }}
          >
            {languages.map((l) => (
              <option key={l.code || "all"} value={l.code}>
                {l.name}
              </option>
            ))}
          </select>

          {/* --- Search --- */}
          <div className="relative flex items-center">
            <button
              onClick={() => setOpen((prev) => !prev)}
              className="bg-blue-500 px-3 py-1 rounded-md hover:bg-blue-600 text-white flex items-center gap-1 transition-all shadow-md font-bold"
              style={{ fontFamily: "'Adobe Garamond Pro', serif" }}
            >
              🔍
              <span
                className={`inline-block transform transition-transform duration-300 ${
                  open ? "rotate-90" : "rotate-0"
                }`}
              >
                ▶
              </span>
            </button>

            <input
              type="text"
              placeholder="Search movies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSearch()}
              className={`absolute left-full ml-2 transition-all duration-300 ease-in-out p-1.5 rounded-md text-white shadow-md border border-gray-600 font-bold text-sm ${
                open ? "w-40 opacity-100" : "w-0 opacity-0"
              }`}
              style={{
                fontFamily: "'Adobe Garamond Pro', serif",
                background: "linear-gradient(to right, #f43f5e, #fbbf24)",
              }}
            />
          </div>
        </div>

        {/* --- Right Side (Links + Theme + Lists) --- */}
        <div className="flex gap-3 items-center">
          <Link to="/" title="Home" className="hover:text-yellow-400">🏠</Link>
          <Link to="/admin" title="Admin" className="hover:text-yellow-400">⚙️</Link>

          {/* --- My List Dropdown --- */}
          <div className="relative">
            <button
              onClick={() => setShowListMenu((prev) => !prev)}
              className="hover:text-yellow-400 text-sm font-semibold flex items-center gap-1"
            >
              📋 My List ▾
            </button>

            {showListMenu && (
              <div className="absolute right-0 mt-2 w-36 bg-white text-black rounded-lg shadow-lg z-50 text-sm overflow-hidden">
                <Link
                  to="/favorites"
                  className="block px-3 py-2 hover:bg-gray-200 transition"
                >
                  ❤️ Favorites
                </Link>
                <Link
                  to="/watchlist"
                  className="block px-3 py-2 hover:bg-gray-200 transition"
                >
                  🔖 Watchlist
                </Link>
              </div>
            )}
          </div>

          {/* --- Auth & Theme --- */}
          {!user ? (
            <Link to="/login" className="hover:text-yellow-400 flex items-center gap-1">
              🔑 <span className="text-sm font-semibold">Login</span>
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              {user.picture && (
                <img
                  src={user.picture}
                  alt="Profile"
                  className="w-6 h-6 rounded-full border border-white"
                />
              )}
              <span
                className="text-sm font-semibold italic"
                style={{
                  background: "linear-gradient(90deg, #099ba3, #c4eb14, #eb38ac)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Hello, {user.name || "User"}
              </span>
              <button
                onClick={logout}
                title="Logout"
                className="hover:text-yellow-400 text-sm"
              >
                🔓
              </button>
            </div>
          )}

          <button
            onClick={toggleTheme}
            title="Toggle Theme"
            className="hover:text-yellow-400 text-sm"
          >
            {theme === "dark" ? "☀" : "🌙"}
          </button>
        </div>
      </div>
    </nav>
  );
}
