// controllers/movies.js

const MovieModel = require('../models/movie');

const ValidationError = require('../errors/ValidationError');
const NotFoundError = require('../errors/NotFoundErr');
const ForbiddenError = require('../errors/ForbiddenError');

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  return MovieModel.create(
    {
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      thumbnail,
      owner: req.user.id,
      movieId,
      nameRU,
      nameEN,
    },
  )
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationError('Переданы некорректные данные'));
      }
      return next(err); // Передаем ошибку дальше для централизованной обработки
    });
};

const getMovies = (req, res, next) => {
  MovieModel.find({ owner: req.user.id }) // Фильтрация по полю owner
    .then((data) => {
      res.status(200).send(data);
    })
    .catch(next);
};

const deleteMovie = async (req, res, next) => {
  const { movieId } = req.params;

  try {
    const movie = await MovieModel.findById(movieId).orFail();

    // Проверка владельца карточки
    if (movie.owner.toString() !== req.user.id) {
      return next(new ForbiddenError('У вас нет прав для удаления этого фильма'));
    }

    // Удаление карточки с использованием findByIdAndDelete
    const deletedMovie = await MovieModel.findByIdAndDelete(movieId);

    // Если запрос вернул данные, отправляем успешный ответ
    return res.status(200).send(deletedMovie);
  } catch (err) {
    if (err.name === 'DocumentNotFoundError') {
      return next(new NotFoundError('Фильм по указанному _id не найден'));
    } if (err.name === 'CastError') {
      return next(new ValidationError('Переданы некорректные данные'));
    }
    return next(err);
  }
};

module.exports = {
  createCard: createMovie,
  getCards: getMovies,
  deleteCard: deleteMovie,
};
