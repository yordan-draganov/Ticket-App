import React from "react";
import "../css/SearchBar.css";

export default function SearchBar({ searchTerm, setSearchTerm }) {
  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Search events by title, location or date..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
      <span className="search-icon">🔍</span>
    </div>
  );
}