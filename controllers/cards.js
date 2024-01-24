// controllers/cards.js

const http2 = require('http2');
const CardModel = require('../models/card');

const ValidationError = require('../errors/ValidationError');
const NotFoundError = require('../errors/NotFoundErr');
const ForbiddenError = require('../errors/ForbiddenError');

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  return CardModel.create({ name, link, owner: req.user.id })
    .then((data) => {
      // res.status(http2.constants.HTTP_STATUS_CREATED).send(data);
      res.status(200).send(data);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationError('Переданы некорректные данные'));
      }
      return next(err); // Передаем ошибку дальше для централизованной обработки
    });
};

/*
{
    "likes": [],
    "_id": "659da44ea0ca9764939fe475",
    "name": "Спрингфилд",
    "link": "https://angliya.com/uploads/4/0/0/4008e52eae5895d77cf2a161800213b7.jpg",
    "owner": {
        "name": "Губка Боб",
        "about": "Житель океана",
        "avatar": "https://e7.pngegg.com/pngimages/13/178/png-clipart-spongebob-squarepants-illustration-graphy-computer-icons-sponge-bob-cartoon-spongebob-squarepants.png",
        "_id": "bba7060593119ffd8fc1af1f",
        "cohort": "cohort-72"
    },
    "createdAt": "2024-01-09T19:53:50.222Z"
}

{
    "name": "Спрингфилд",
    "link": "https://angliya.com/uploads/4/0/0/4008e52eae5895d77cf2a161800213b7.jpg",
    "owner": "659d01684ab418b1a6a65f17",
    "likes": [],
    "_id": "659da5203869ff13786ef0a4",
    "createdAt": "2024-01-09T19:57:20.933Z",
    "__v": 0
}
*/

const getCards = (req, res, next) => {
  CardModel.find()
    .then((data) => {
      res.status(200).send(data);
    })
    .catch(next);
};

const deleteCard = async (req, res, next) => {
  const { cardId } = req.params;
  console.log('deleteCard_CONTROLLER');

  try {
    const card = await CardModel.findById(cardId).orFail();

    // Проверка владельца карточки
    if (card.owner.toString() !== req.user.id) {
      return next(new ForbiddenError('У вас нет прав для удаления этой карточки'));
    }

    // Удаление карточки с использованием findByIdAndDelete
    const deletedCard = await CardModel.findByIdAndDelete(cardId);

    // Если запрос вернул данные, отправляем успешный ответ
    return res.status(200).send(deletedCard);
  } catch (err) {
    if (err.name === 'DocumentNotFoundError') {
      return next(new NotFoundError('Карточка по указанному _id не найдена'));
    } if (err.name === 'CastError') {
      return next(new ValidationError('Переданы некорректные данные'));
    }
    return next(err);
  }
};

const addCardLike = (req, res, next) => {
  CardModel.findByIdAndUpdate(
    req.params.cardId,
    // console.log(req.params.cardId),
    { $addToSet: { likes: req.user.id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((data) => {
      if (!data) {
        return next(new NotFoundError('Передан несуществующий _id карточки'));
      }
      console.log(data);
      return res.status(http2.constants.HTTP_STATUS_OK).send(data);
    })

    .catch((err) => {
      if (err.name === 'CastError') {
        // Если неправильный формат ID, отправляем 400 ошибку
        return next(new ValidationError('Переданы некорректные данные для постановки/снятии лайка'));
      }
      // В случае других ошибок, отправляем 500 ошибку
      return next(err);
    });
};

const removeCardLike = (req, res, next) => {
  CardModel.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user.id } }, // убрать _id из массива
    { new: true },
  )
    .then((data) => {
      if (!data) {
        return next(new NotFoundError('Передан несуществующий _id карточки'));
      }
      // return res.status(http2.constants.HTTP_STATUS_OK).send(data);
      return res.status(200).send(data);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new ValidationError('Переданы некорректные данные для постановки/снятия лайка'));
      }
      return next(err);
    });
};

module.exports = {
  createCard,
  getCards,
  deleteCard,
  addCardLike,
  removeCardLike,
};
