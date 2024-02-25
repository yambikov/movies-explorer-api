// routes/cards.js

const movieRouter = require('express').Router(); // создаем роуты фильмов
const {
  createCard: createMovie,
  getCards: getMovies,
  deleteCard: deleteMovie,
} = require('../controllers/movies');

const {
  validateCreateCard: validateCreateMovie,
  validateCardId: validateMovieId,
} = require('../middlewares/validation');

movieRouter.post('/', validateCreateMovie, createMovie); // полный путь /movies/
movieRouter.get('/', getMovies); // полный путь /movies/
movieRouter.delete('/:movieId', validateMovieId, deleteMovie); // полный путь /movies/:movieId

module.exports = movieRouter;
