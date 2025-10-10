import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="fixed top-0 w-full z-40 bg-gradient-to-r from-blue-900 via-indigo-800 to-purple-700 text-white shadow-lg backdrop-blur-lg transition-all duration-500">
      <div className="max-w-7xl mx-auto px-4 h-10 flex justify-between items-center relative">
        
        <Link to="/" className="flex items-center gap-2">
          <img
            src="https://png.pngtree.com/element_our/20190603/ourmid/pngtree-movie-board-icon-image_1455346.jpg"
            alt="CineScope Logo"
            className="w-6 h-6 object-contain drop-shadow-lg"
          />
          <span className="text-base font-extrabold tracking-wide">CineScope</span>
        </Link>

        
        {user && (
          <div
            className="absolute left-1/2 transform -translate-x-1/2 text-center"
            style={{
              fontFamily: "'Adobe Garamond Pro', serif",
              fontWeight: "bold",
              fontStyle: "italic",
              background: "linear-gradient(90deg, #099ba3ff, #c4eb14ff, #eb38acff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontSize: "2.0rem",
              letterSpacing: "1px",
              width: "1000px", 
              whiteSpace: "nowrap",
            }}
          >
            🌟 Hello, {user.name || "User"} 🌟
          </div>
        )}

        
        <div className="flex gap-3 items-center">
          <Link to="/" title="Home" className="hover:text-yellow-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l9-9 9 9M4 10v10h16V10"
              />
            </svg>
          </Link>

          <Link to="/admin" title="Admin" className="hover:text-yellow-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 0V3m0 18v-5m8-4h-5m-8 0H3m15.36 6.36l-3.54-3.54m-6.36 0l-3.54 3.54m0-6.36l3.54 3.54m6.36 0l3.54-3.54"
              />
            </svg>
          </Link>

          {!user ? (
            <Link to="/login" title="Login" className="hover:text-yellow-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 7h3a2 2 0 012 2v4a2 2 0 01-2 2h-3m-6 4h6m-6-8h6m-3 4v4"
                />
              </svg>
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              {user.picture && (
                <img
                  src={user.picture}
                  alt="Profile"
                  className="w-6 h-6 rounded-full"
                />
              )}
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
