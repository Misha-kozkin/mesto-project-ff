import { likeCard, unlikeCard } from '../components/api.js';
import { currentUserId } from '../index.js';

// Темплейт карточки
const cardTemplate = document.querySelector('#card-template').content;

// Функция создания карточки
export function createCard(elements, imageClick, handleLikeClick, handleDeleteCard, userId) {
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
  const cardImage = cardElement.querySelector('.card__image');
  const likeButton = cardElement.querySelector('.card__like-button');
  const likeCounter = cardElement.querySelector('.cards__like-counter');
  const deleteButton = cardElement.querySelector('.card__delete-button');

  cardElement.querySelector('.card__title').textContent = elements.name;
  cardImage.src = elements.link;
  cardImage.alt = elements.name;
  likeCounter.textContent = elements.likes.length;

    // Показываем, поставил ли пользователь лайк
    const isLiked = elements.likes.some(user => user._id === userId);
    if (isLiked) {
      likeButton.classList.add('card__like-button_is-active');
    }

  if (elements.owner._id !== userId) {
    deleteButton.style.display = 'none';
  }

  cardImage.addEventListener('click', () => {
    imageClick(elements.name, elements.link);
  });

  likeButton.addEventListener('click', () => {
    handleLikeClick({
      cardId: elements._id,
      likeButton,
      likeCounter,
      isLiked: likeButton.classList.contains('card__like-button_is-active')
    });
  });

  deleteButton.addEventListener('click', () => {
    handleDeleteCard(elements._id, cardElement);
  });

  return cardElement;
};

// обработчик лайка и дизлайка
export function handleLikeButton({ cardId, likeButton, likeCounter, isLiked }) {
  const action = isLiked ? unlikeCard : likeCard;

  action(cardId)
    .then((updatedCard) => {
      // обновление счетчика
      likeCounter.textContent = updatedCard.likes.length;

      // переключение класса
      if (updatedCard.likes.some(user => user._id === currentUserId)) {
        likeButton.classList.add('card__like-button_is-active');
      } else {
        likeButton.classList.remove('card__like-button_is-active');
      }
    })
    .catch(err => {
      console.log('Ошибка при обновлении лайка:', err);
    });
}