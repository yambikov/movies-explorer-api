/* eslint-disable max-len */
const { Joi, celebrate } = require('celebrate');

const regexAvatar = /^https?:\/\/(www\.)?[0-9a-zA-Z]+([.|-]{1}[0-9a-zA-Z]+)*\.[0-9a-zA-Z-]+(\/[0-9a-zA-Z\-._~:/?#[\]@!$&'()*+,;=]*#?)?$/;

const validateCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
});

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const validateUpdateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().email().required(),
  }),
});

const validateCreateMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().regex(regexAvatar).required(),
    trailerLink: Joi.string().regex(regexAvatar).required(),
    thumbnail: Joi.string().regex(regexAvatar).required(),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

const validateUserId = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24).required(),
  }),
});

const validateMovieId = celebrate({
  params: Joi.object().keys({
    // movieId: Joi.string().hex().length(24).required(),
    movieId: Joi.string().hex().required(),
  }),
});

module.exports = {
  validateCreateUser,
  validateLogin,
  validateUpdateUser,
  validateCreateCard: validateCreateMovie,
  validateUserId,
  validateCardId: validateMovieId,
};
