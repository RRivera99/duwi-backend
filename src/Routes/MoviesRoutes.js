const express = require('express');
const moviesController = require('../Controllers/MoviesControllers');
const favController = require('../Controllers/FavControllersMovies');

const router = express.Router();

router.get('/movies', moviesController.getMovies);
router.get('/movies/:id', moviesController.getMovieById);
router.get('/movies/title/:title', moviesController.getMovieByTitle);
router.get('/top-movies', moviesController.getTopMovies);
router.get('/movies/genre/:genre', moviesController.getMoviesByGenre);
router.get('/enabledMovies', moviesController.getEnabledMovies);
router.get('/disableMovies', moviesController.getDisableMovies);

router.get('/movies/byObjectId/:id', moviesController.getMovieByObjectId); 

router.post('/movies', moviesController.postMovie);
router.put('/movies/byObjectId/:id', moviesController.putMovie); 


//RUTAS FAVORITOS DE MOVIES
router.post('/favorites/movies', favController.addMovieToFavorite);
router.get('/favorites/movies/:userId', favController.getFavoriteMoviesByUser);
router.delete('/favorites/movies/:userId/:movieId', favController.deleteMovieFromFavorite);

router.put('/movies/enable/:movieId', moviesController.enableMovie);
router.put('/movies/disable/:movieId', moviesController.disableMovie);

module.exports = router;
