import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { axiosInstance } from "../lib/axios";

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/movies/${id}`);
        setMovie(res.data.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching movie:", err);
        setLoading(false);
      }
    };
    fetchMovie();
  }, [id]);

  if (loading || !movie) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-900 text-white">
      {/* Hero Section */}
      <div
        className="relative h-96 bg-cover bg-center rounded-b-3xl overflow-hidden"
        style={{ backgroundImage: `url(${movie.posterImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent"></div>
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 bg-gray-800 bg-opacity-60 px-4 py-2 rounded-lg hover:bg-gray-700 transition"
        >
          ← Back
        </button>
        <div className="absolute bottom-6 left-6">
          <h1 className="text-4xl md:text-5xl font-bold">{movie.title}</h1>
          <p className="mt-2 text-gray-300 hidden md:block">{movie.description}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-8 flex flex-col md:flex-row gap-10">
        {/* Left: Poster & Booking */}
        <div className="flex flex-col items-center md:items-start md:w-1/3 gap-6">
          <img
            src={movie.posterImage}
            alt={movie.title}
            className="w-64 rounded-lg shadow-lg"
          />
          <Link
            to={`seat-selector`}
            className="w-full text-center bg-red-600 hover:bg-red-700 transition px-6 py-3 font-bold rounded-lg"
          >
            Book Your Seat
          </Link>

          {/* Movie Info */}
          <div className="mt-6 space-y-2 text-gray-300 text-sm md:text-base">
            <p><strong>Genre:</strong> {movie.genre}</p>
            <p><strong>Duration:</strong> {movie.duration} mins</p>
            <p><strong>Release:</strong> {new Date(movie.releaseDate).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Right: Description, Trailer, Cast, Gallery */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Description */}
          <div>
            <h2 className="text-2xl font-semibold mb-2">Synopsis</h2>
            <p className="text-gray-300">{movie.description}</p>
          </div>

          {/* Trailer */}
          {movie.trailerUrl && (
            <div>
              <h2 className="text-2xl font-semibold mb-2">Trailer</h2>
              <iframe
                width="100%"
                height="400"
                src={movie.trailerUrl.replace("watch?v=", "embed/")}
                title="Movie Trailer"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-lg"
              ></iframe>
            </div>
          )}

          {/* Cast */}
          {movie.cast?.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-2">Cast</h2>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {movie.cast.map((actor, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-800 px-4 py-2 rounded-lg text-center min-w-max"
                  >
                    {actor}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Gallery */}
          {movie.movieImages?.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-2">Gallery</h2>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {movie.movieImages.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Movie ${idx + 1}`}
                    className="h-48 w-64 object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
