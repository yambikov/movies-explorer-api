// app.js

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const { errors } = require('celebrate');
const cors = require('cors');
const rateLimiter = require('./middlewares/rateLimiter');
const errorHandler = require('./middlewares/errorHandler');
const {
  validateCreateUser,
  validateLogin,
} = require('./middlewares/validation');
const { requestLogger, errorLogger } = require('./middlewares/logger');

// Загружаем переменные окружения из файла .env
dotenv.config();

const { isAuthorized } = require('./middlewares/auth');
const { login, createUser } = require('./controllers/users');
const NotFoundError = require('./errors/NotFoundErr');

const {
  PORT, MONGODB_URI, NODE_ENV,
} = process.env;

mongoose.connect(NODE_ENV === 'production' ? MONGODB_URI : 'mongodb://127.0.0.1:27017/bitfilmsdb', {
  useNewUrlParser: true,
}).then(() => {
  console.log('Подключено к MongoDB');
});

const app = express();

app.use(helmet());
app.use(rateLimiter);

// app.use(cors());
app.use(cors({
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));

app.use(express.json());

app.use(requestLogger); // подключаем логгер запросов за ним идут все обработчики роутов

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use('/signin', validateLogin, login);
app.use('/signup', validateCreateUser, createUser);

app.use(isAuthorized);
app.use('/users', require('./routes/users'));
app.use('/movies', require('./routes/movies'));

app.use('/*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

// errorLogger нужно подключить после обработчиков роутов и до обработчиков ошибок
app.use(errorLogger);

// обработчик ошибок celebrate
app.use(errors());

// это обработчик ошибки
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Пример приложения слушает порт ${PORT}`);
});
