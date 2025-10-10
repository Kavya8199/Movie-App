import React, { useState } from "react";

export default function FilterBar({ search, setSearch, onSearch, filters, onFiltersChange }) {
  const [open, setOpen] = useState(false);

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
    "p-2 rounded-md text-black shadow-md hover:opacity-90 transition-all font-bold";

  return (
    <div className="flex flex-wrap gap-4 items-center justify-center my-2 p-3 rounded-md">
      
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

      
      <div className="relative flex items-center">
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="bg-blue-500 px-4 py-2 rounded-md hover:bg-blue-600 text-white flex items-center gap-2 transition-all shadow-md font-bold"
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
          className={`absolute left-full ml-2 transition-all duration-300 ease-in-out p-2 rounded-md text-white shadow-md border border-gray-600 font-bold ${
            open ? "w-64 opacity-100" : "w-0 opacity-0"
          }`}
          style={{
            fontFamily: "'Adobe Garamond Pro', serif",
            background: "linear-gradient(to right, #f43f5e, #fbbf24)",
          }}
        />
      </div>
    </div>
  );
}
