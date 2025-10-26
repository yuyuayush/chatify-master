import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true },
    description: { type: String, trim: true },
    duration: { type: Number, }, // in minutes
    genre: { type: String, trim: true },
    releaseDate: { type: Date },
    trailerUrl: { type: String, trim: true },
    cast: [{ type: String, trim: true }],
    posterImage: { type: String, trim: true },
    movieImages: [{ type: String, trim: true }],
  },
  { timestamps: true }
);

const Movie = mongoose.model("Movie", movieSchema);
export default Movie;
