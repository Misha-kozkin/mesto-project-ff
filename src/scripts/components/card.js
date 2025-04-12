// Темплейт карточки
const cardTemplate = document.querySelector('#card-template').content;

// Функция создания карточки
export function createCard(elements, imageClick) {
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
  const cardImage = cardElement.querySelector('.card__image');
  const likeButton = cardElement.querySelector('.card__like-button');
  const deleteButton = cardElement.querySelector('.card__delete-button');

  cardElement.querySelector('.card__title').textContent = elements.name;
  cardImage.src = elements.link;
  cardImage.alt = elements.name;

  cardImage.addEventListener('click', () => {
    imageClick(elements.name, elements.link);
  });

  likeButton.addEventListener('click', () => {
    handleLikeButton(likeButton);
  });

  deleteButton.addEventListener('click', () => {
    deleteCard(cardElement);
  });

  return cardElement;
};

// Обработчик лайка
function handleLikeButton(likeButton) {
  likeButton.classList.toggle('card__like-button_is-active');
};

// Функция удаления карточки
function deleteCard(cardElement) {
  cardElement.remove();
};

