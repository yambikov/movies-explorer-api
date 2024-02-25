// models/user.js

const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const UnauthorizedError = require('../errors/UnauthorizedError');

const userSchema = new mongoose.Schema({
  name: {
    type: String, // тип данных - строка
    minlength: 2, // минимальная длина строки
    maxlength: 30, // максимальная длина строки
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value) => validator.isEmail(value),
      message: 'Неправильный формат почты',
    },
  },
  password: {
    type: String,
    required: true,
    select: false, // не возвращать пароль при запросе
  },

});

// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Неверные логин или пароль');
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError('Неверные логин или пароль');
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
