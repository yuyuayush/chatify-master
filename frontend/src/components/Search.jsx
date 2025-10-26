import React, { useState, useRef } from "react";
import {axiosInstance} from "../lib/axios";
const MovieSearch = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);

  // Function to fetch movie suggestions
  const fetchSuggestions = async (q) => {
    if (!q) {
      setSuggestions([]);
      return;
    }
    setLoading(true);
    try {
      const res = await axiosInstance.get(`search?q=${q}`);
      setSuggestions(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle input change with debounce
  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    // Clear previous debounce
    if (debounceRef.current) clearTimeout(debounceRef.current);

    // Set new debounce
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 500); // 500ms delay
  };

  return (
    <div className="w-full max-w-md mx-auto mt-10">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search movies..."
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {loading && <p className="mt-2 text-gray-500">Loading...</p>}

      {suggestions.length > 0 && (
        <ul className="mt-2 border border-gray-300 rounded-md max-h-60 overflow-y-auto">
          {suggestions.map((movie, index) => (
            <li
              key={index}
              className="p-2 hover:bg-blue-100 cursor-pointer"
            >
              {movie.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MovieSearch;
