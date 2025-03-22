// @todo: Темплейт карточки
const cardTemplate = document.querySelector('#card-template').content;

// @todo: DOM узлы
const placesList = document.querySelector('.places__list');

// @todo: Функция создания карточки
function cardCreation(elements) {
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);

  cardElement.querySelector('.card__title').textContent = elements.name;
  cardElement.querySelector('.card__image').src = elements.link;
  cardElement.querySelector('.card__image').alt = elements.name;

  const deleteButton = cardElement.querySelector('.card__delete-button');
  deleteButton.addEventListener('click', () => deleteCard(cardElement));

  return cardElement;
};

// @todo: Функция удаления карточки
function deleteCard(card) {
  card.remove();
};

// @todo: Вывести карточки на страницу
initialCards.forEach(item => {
  placesList.append(cardCreation(item));
});