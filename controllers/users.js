// controllers/users.js

const http2 = require('http2');
const bcrypt = require('bcryptjs');
const userModel = require('../models/user');
const { generateJwtToken } = require('../utils/jwt');

const ValidationError = require('../errors/ValidationError');
const ConflictError = require('../errors/ConflictError');
const NotFoundError = require('../errors/NotFoundErr');

const MONGO_DUPLICATE_ERROR_CODE = 11000;
const HASH_SALT_ROUNDS = 10;

const createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  console.log('REGISTER CONTROLLER');
  bcrypt
    .hash(password, HASH_SALT_ROUNDS)
    .then((hashedPassword) => userModel.create({
      name,
      email,
      password: hashedPassword,
    }))
    .then((user) => {
      const userWithoutPassword = user.toObject();
      delete userWithoutPassword.password;
      res.status(200).send(userWithoutPassword);
    })
    .catch((err) => {
      if (err.code === MONGO_DUPLICATE_ERROR_CODE) {
        return next(new ConflictError('Пользователь уже существует'));
      }
      if (err.name === 'ValidationError') {
        return next(new ValidationError('Переданы некорректные данные при создании пользователя'));
      }
      return next(err); // Передаем ошибку дальше для централизованной обработки
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return userModel
    .findUserByCredentials(email, password)
    .then((user) => {
      const token = generateJwtToken({ id: user._id });
      return res
        .status(http2.constants.HTTP_STATUS_OK)
        .send({ token });
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
  const { name, email } = req.body;
  userModel
    .findByIdAndUpdate(
      req.user.id,
      { name, email },
      { new: true, runValidators: true },
    )
    .then((data) => {
      if (!data) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.status(http2.constants.HTTP_STATUS_OK).send(data);
    })
    .catch((err) => {
      if (err.code === MONGO_DUPLICATE_ERROR_CODE) {
        return next(new ConflictError('Пользователь с таким email уже существует'));
      }
      if (err.name === 'ValidationError') {
        return next(new ValidationError('Переданы некорректные данные при обновлении пользователя'));
      }
      if (err.name === 'CastError') {
        return next(new ValidationError('Некорректный формат ID пользователя'));
      }
      return next(err);
    });
};

const getCurrentUser = (req, res, next) => {
  const userId = req.user.id; // Получаем id из аутентифицированного пользователя в объекте запроса
  userModel
    .findById(userId)
    .then((data) => {
      if (!data) {
        throw new NotFoundError('Пользователь не найден');
      }
      return res.status(http2.constants.HTTP_STATUS_OK).send(data);
    })
    .catch(next);
};

module.exports = {
  createUser,
  login,
  updateUser,
  getCurrentUser,
};
