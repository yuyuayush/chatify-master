import Movie from "../models/Movie.js";
import { dummyMovies } from "../utils/index.js";
import redisHandler from "../utils/redisHandler.js";
import { responseError, responseSuccess } from "../utils/responseHandler.js"

export const getMovieById = async (req, res) => {

  const { id } = req.params;
  try {
    const cachedKey = `movie:${id}`;
    const cachedMovie = await redisHandler.get(cachedKey);
    if (cachedMovie) {
      return responseSuccess(res, cachedMovie, "Movie details fetched from cache", 200);
    }

    const movieDetails = await Movie.findById(id);
    if (!movieDetails) {
      return responseError(res, "No such movie found", 404)
    }
    redisHandler.set(cachedKey, movieDetails, 600);
    responseSuccess(res, movieDetails, "Movie details fetched successfully", 200);
  } catch (error) {
    responseError(res, "Failed to get movie details", 500);
  }

}


export const getAllMovies = async (req, res) => {

  try {
    const cachedKey = 'all-movies';
    const cachedMovies = await redisHandler.get(cachedKey);
    if (cachedMovies) {
      return responseSuccess(res, cachedMovies, "All movie details fetched from cache", 200);
    }

    const movie = await Movie.find();
    if (!movie) {
      return responseError(res, "No such movie found", 404)
    }
    redisHandler.set(cachedKey, movie, 600);
    responseSuccess(res, movie, "Movie details fetched successfully", 200);
  } catch (error) {
    responseError(res, "Failed to get movie details", 500);
  }

}


export const createMovie = async (req, res) => {
  try {
    const data = req.body;

    if (!data) {
      return res.status(400).json({ success: false, message: "No data provided" });
    }

    // Create single movie
    if (!Array.isArray(data)) {
      const movie = await Movie.create(data);
      return res.status(201).json({
        success: true,
        message: "Movie created successfully",
        movie,
      });
    }

    // Create multiple movies
    if (Array.isArray(data) && data.length > 0) {
      const movies = await Movie.insertMany(data);
      return res.status(201).json({
        success: true,
        message: `${movies.length} movies created successfully`,
        movies,
      });
    }

    res.status(400).json({ success: false, message: "Invalid data format" });
  } catch (error) {
    console.error("Error creating movie:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create movie(s)",
      error: error.message,
    });
  }
};

export const insertDummyMovies = async (req, res) => {
  try {

    const movies = await Movie.insertMany(dummyMovies);

    responseSuccess(res, movies, "Dummy movies inserted successfully", 201);
  } catch (error) {
    console.error("Error inserting movies:", error);
    responseError(res, "Failed to insert dummy movies", 500);
  }
};
