// models/card.js

const mongoose = require('mongoose');
const validator = require('validator');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (string) => validator.isURL(string),
      message: 'Неправильный формат ссылки',
    },
  },
  trailerLink: {
    type: String,
    required: true,
    validate: {
      validator: (string) => validator.isURL(string),
      message: 'Неправильный формат ссылки',
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: (string) => validator.isURL(string),
      message: 'Неправильный формат ссылки',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },

});

module.exports = mongoose.model('movie', movieSchema);

// const mongoose = require('mongoose');
// const validator = require('validator');

// const cardSchema = new mongoose.Schema({
//   name: {
//     type: String, // тип данных - строка
//     required: true, // обязательное поле
//     minlength: 2, // минимальная длина строки
//     maxlength: 30, // максимальная длина строки
//   },
//   link: {
//     type: String,
//     required: true,
//     validate: {
//       validator: (string) => {
//         validator.isURL(string);
//       },
//       message: 'Неправильный формат ссылки',
//     },
//   },
//   owner: {
//     type: mongoose.Schema.Types.ObjectId, // связь карточки с моделью пользователя
//     ref: 'user', // ссылка на модель автора карточки
//     required: true,
//   },
//   likes: [{
//     type: mongoose.Schema.Types.ObjectId, // связь карточки с моделью пользователя
//     ref: 'user',
//     default: [],
//   }],
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// module.exports = mongoose.model('card', cardSchema);
