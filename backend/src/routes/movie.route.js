import { Router } from 'express'
import { createMovie, getAllMovies, getMovieById, insertDummyMovies } from '../controllers/movie.controller.js';

const movieRoute = Router();

movieRoute.get("/:id", getMovieById);
movieRoute.get("/", getAllMovies);
movieRoute.post("/", createMovie);
movieRoute.post("/data", insertDummyMovies);

export default movieRoute;