// routes/users.js

const userRouter = require('express').Router(); // создаем роуты юзера

const { updateUser, getCurrentUser } = require('../controllers/users');
const { validateUpdateUser } = require('../middlewares/validation');

userRouter.get('/me', getCurrentUser); // полный путь /users/me
userRouter.patch('/me', validateUpdateUser, updateUser); // полный путь /users/me

module.exports = userRouter;
