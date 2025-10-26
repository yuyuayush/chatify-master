import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { axiosInstance } from "../lib/axios";
import MovieSearch from "../components/Search";

const MovieList = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [status, setStatus] = useState("loading");

  const fetchMovies = async () => {
    try {
      setStatus("loading");
      const response = await axiosInstance.get("/movies/"); // ✅ check your backend route
      setMovies(response.data.data);
      setStatus("success");
    } catch (error) {
      console.error("Error fetching movies:", error);
      setStatus("error");
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <p>⚠️ Failed to load movies. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">


      <MovieSearch />
      <h1 className="text-4xl font-bold mb-6 text-center">🎥 Now Showing</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {movies.map((movie) => (
          <div
            key={movie._id}
            onClick={() => navigate(`/movies/${movie._id}`)}
            className="bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:scale-105 hover:shadow-xl transition-transform cursor-pointer"
          >
            <img src={movie.image} alt={movie.title} className="w-full h-72 object-cover" />
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{movie.title}</h3>
              <p className="text-gray-400 text-sm">{movie.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieList;
